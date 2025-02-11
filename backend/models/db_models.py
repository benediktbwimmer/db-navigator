from typing import List, Any, Dict, Optional
from pydantic import BaseModel

class TableSchema(BaseModel):
    """Schema information for a database table column."""
    column_name: str
    data_type: str
    references: Optional[Dict[str, str]] = None

class DatabaseSchema(BaseModel):
    """Complete database schema representation."""
    tables: Dict[str, List[TableSchema]]

class QueryResult(BaseModel):
    """Results from a database query."""
    columns: List[str]
    rows: List[List[Any]]