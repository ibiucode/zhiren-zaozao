"""3D 檔案分析與儲存（Phase 5）。

設計取捨：僅用標準庫（struct / re），不引入 trimesh / numpy，確保安裝可靠、易驗證。
- STL（binary / ASCII）、OBJ：解析出三角面 → 計算 bounding box（尺寸）、三角面數、
  以及以「邊界邊（boundary edge）」判斷是否封閉（破面提醒）。
- STEP：CAD 邊界表示法，無法用標準庫做網格分析，僅做格式 / 大小檢查並標記 unsupported。
重運算（壁厚、自動估價核心）為未來工作。
"""
import os
import re
import struct
import uuid
from math import inf

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.inquiry import InquiryFile

# 三角面數超過此上限時略過破面檢查（避免大型檔案拖慢）。
_MANIFOLD_CAP = 1_500_000


def _ext(filename: str) -> str:
    idx = (filename or "").rfind(".")
    return filename[idx + 1:].lower() if idx >= 0 else ""


def _parse_binary_stl(content: bytes, n: int):
    tri = struct.Struct("<12fH")  # 法向量3 + 3頂點(9) + 2byte 屬性 = 50 bytes
    region = content[84:84 + n * 50]
    for vals in tri.iter_unpack(region):
        yield ((vals[3], vals[4], vals[5]), (vals[6], vals[7], vals[8]), (vals[9], vals[10], vals[11]))


def _parse_ascii_stl(text: str):
    nums = re.findall(r"vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)", text)
    for i in range(0, len(nums) - 2, 3):
        yield (
            tuple(map(float, nums[i])),
            tuple(map(float, nums[i + 1])),
            tuple(map(float, nums[i + 2])),
        )


def _parse_stl(content: bytes):
    if len(content) >= 84:
        n = struct.unpack_from("<I", content, 80)[0]
        if n > 0 and len(content) == 84 + n * 50:
            return list(_parse_binary_stl(content, n))
    return list(_parse_ascii_stl(content.decode("utf-8", "ignore")))


def _parse_obj(text: str):
    verts = []
    tris = []
    for line in text.splitlines():
        if line.startswith("v "):
            p = line.split()
            if len(p) >= 4:
                verts.append((float(p[1]), float(p[2]), float(p[3])))
        elif line.startswith("f "):
            idxs = []
            for tok in line.split()[1:]:
                raw = tok.split("/")[0]
                if not raw:
                    continue
                vi = int(raw)
                vi = len(verts) + vi if vi < 0 else vi - 1  # 支援負索引
                idxs.append(vi)
            for k in range(1, len(idxs) - 1):  # 多邊形扇形三角化
                a, b, c = idxs[0], idxs[k], idxs[k + 1]
                if 0 <= a < len(verts) and 0 <= b < len(verts) and 0 <= c < len(verts):
                    tris.append((verts[a], verts[b], verts[c]))
    return tris


def _mesh_stats(tris, do_manifold: bool):
    minx = miny = minz = inf
    maxx = maxy = maxz = -inf
    ids = {}
    edge_count = {}

    def q(p):
        return (round(p[0], 4), round(p[1], 4), round(p[2], 4))

    for a, b, c in tris:
        for x, y, z in (a, b, c):
            if x < minx: minx = x
            if y < miny: miny = y
            if z < minz: minz = z
            if x > maxx: maxx = x
            if y > maxy: maxy = y
            if z > maxz: maxz = z
        if do_manifold:
            ia = ids.setdefault(q(a), len(ids))
            ib = ids.setdefault(q(b), len(ids))
            ic = ids.setdefault(q(c), len(ids))
            for u, v in ((ia, ib), (ib, ic), (ic, ia)):
                e = (u, v) if u < v else (v, u)
                edge_count[e] = edge_count.get(e, 0) + 1

    dims = (maxx - minx, maxy - miny, maxz - minz)
    boundary = sum(1 for v in edge_count.values() if v != 2) if do_manifold else None
    watertight = (boundary == 0) if do_manifold else None
    return dims, len(tris), watertight, boundary


def analyze_upload(filename: str, content: bytes) -> dict:
    """分析上傳的 3D 檔案，回傳 snake_case 結構（對齊 schema 欄位名）。"""
    ext = _ext(filename)
    size = len(content)
    result = {
        "file_name": filename,
        "file_size": size,
        "file_format": ext,
        "check_status": "ok",
        "check_result": {
            "dimensions_mm": None,
            "triangle_count": None,
            "watertight": None,
            "boundary_edges": None,
            "warnings": [],
            "errors": [],
        },
    }
    cr = result["check_result"]

    if ext not in settings.allowed_file_formats_list:
        cr["errors"].append(f"不支援的格式：.{ext or '未知'}")
        result["check_status"] = "error"
        return result
    if size == 0:
        cr["errors"].append("檔案為空")
        result["check_status"] = "error"
        return result
    if size > settings.max_upload_bytes:
        cr["errors"].append(f"檔案超過大小上限（{settings.max_upload_mb}MB）")
        result["check_status"] = "error"
        return result

    if ext in ("step", "stp"):
        result["check_status"] = "unsupported"
        cr["warnings"].append("STEP 為 CAD 格式，目前不支援自動尺寸 / 破面分析，將由專人確認。")
        return result

    try:
        tris = _parse_stl(content) if ext == "stl" else _parse_obj(content.decode("utf-8", "ignore"))
    except Exception:
        cr["errors"].append("檔案解析失敗，可能格式損毀。")
        result["check_status"] = "error"
        return result

    if not tris:
        cr["errors"].append("未解析到任何三角面，檔案可能不是有效的網格。")
        result["check_status"] = "error"
        return result

    do_manifold = len(tris) <= _MANIFOLD_CAP
    dims, count, watertight, boundary = _mesh_stats(tris, do_manifold)
    cr["dimensions_mm"] = {"x": round(dims[0], 2), "y": round(dims[1], 2), "z": round(dims[2], 2)}
    cr["triangle_count"] = count

    if do_manifold:
        cr["watertight"] = watertight
        cr["boundary_edges"] = boundary
        if not watertight:
            cr["warnings"].append(
                f"偵測到 {boundary} 條邊界邊，模型可能有破面 / 非封閉，建議修復後再列印。"
            )
    else:
        cr["warnings"].append("三角面數量過多，已略過破面檢查。")

    largest = max(dims)
    if largest > settings.max_print_dimension_mm:
        cr["warnings"].append(
            f"最大尺寸約 {round(largest, 1)}mm，超過常見列印範圍"
            f"（{settings.max_print_dimension_mm:.0f}mm），可能需分件或大型設備。"
        )

    result["check_status"] = "warning" if cr["warnings"] else "ok"
    return result


def save_inquiry_file(db: Session, inquiry_id: int, filename: str, content: bytes, analysis: dict) -> InquiryFile:
    """將檔案存到磁碟並建立 InquiryFile 紀錄（analysis 由呼叫端先算好）。"""
    folder = os.path.join(settings.upload_dir, f"inquiry_{inquiry_id}")
    os.makedirs(folder, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}_{os.path.basename(filename)}"
    path = os.path.join(folder, safe_name)
    with open(path, "wb") as fh:
        fh.write(content)

    obj = InquiryFile(
        inquiry_id=inquiry_id,
        filename=filename,
        stored_path=path,
        file_size=analysis["file_size"],
        file_format=analysis["file_format"],
        check_status=analysis["check_status"],
        check_result=analysis["check_result"],
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
