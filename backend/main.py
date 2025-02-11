# backend/main.py
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.db_tools import get_db_schema, execute_query, get_db_connection
from backend.agents.db_agent import generate_sql

app = FastAPI(title="DB Navigator Enhanced")

# --- Pydantic Models ---
class SchemaResponse(BaseModel):
    schema: dict
    row_counts: dict

class GenerateSQLRequest(BaseModel):
    user_request: str
    selected_tables: list[str] = None

class GenerateSQLResponse(BaseModel):
    sql_query: str

class ExecuteSQLRequest(BaseModel):
    query: str

class ExecuteSQLResponse(BaseModel):
    columns: list[str]
    rows: list[list]

# --- Helper Function ---
async def get_table_row_count(table: str) -> int:
    conn = await get_db_connection()
    try:
        result = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
        return result or 0
    except Exception as e:
        # Optionally log the error
        return 0
    finally:
        await conn.close()

# --- Endpoints ---
@app.get("/api/schema", response_model=SchemaResponse)
async def fetch_schema():
    schema_obj = await get_db_schema()
    row_counts = {}
    # schema_obj is assumed to be a dict with key "tables"
    for table in schema_obj["tables"].keys():
        row_counts[table] = await get_table_row_count(table)
    return {"schema": schema_obj, "row_counts": row_counts}

@app.post("/api/generate-sql", response_model=GenerateSQLResponse)
async def generate_sql_endpoint(request: GenerateSQLRequest):
    # Get the current schema for context
    schema_obj = await get_db_schema()
    prompt = (
        f"You are a database assistant. Given the following database schema: {schema_obj} "
        f"and the user request: \"{request.user_request}\", generate a read-only SQL SELECT query."
    )
    if request.selected_tables:
        prompt += f" Limit your query to the following tables: {', '.join(request.selected_tables)}."
    sql_query = await generate_sql(prompt)
    return {"sql_query": sql_query}

@app.post("/api/execute-sql", response_model=ExecuteSQLResponse)
async def execute_sql(request: ExecuteSQLRequest):
    # Only allow read-only queries (e.g. SELECT, WITH, SHOW, EXPLAIN)
    if not request.query.strip().lower().startswith(("select", "with", "show", "explain")):
        raise HTTPException(status_code=400, detail="Only read-only SELECT queries are allowed.")
    query_result = await execute_query(request.query)
    return {"columns": query_result["columns"], "rows": query_result["rows"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
