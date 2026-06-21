"""共用 schema 基底。

關鍵：欄位以 snake_case 命名（對齊 ORM 屬性），但對外序列化為 camelCase，
以對齊前端 src/data 的結構，讓未來前端切換到此 API 時無需修改。
- alias_generator=to_camel：輸出 camelCase（如 site_name -> siteName）
- populate_by_name=True：輸入時 snake_case 或 camelCase 皆可接受
- from_attributes=True：可直接由 ORM 物件建立
"""
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
