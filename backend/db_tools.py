# backend/db_tools.py
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()
POSTGRES_CONN_STRING = os.getenv("POSTGRES_CONN_STRING")

if not POSTGRES_CONN_STRING:
    raise ValueError("POSTGRES_CONN_STRING is not set in environment variables.")

async def get_db_connection() -> asyncpg.Connection:
    try:
        conn = await asyncpg.connect(POSTGRES_CONN_STRING)
        return conn
    except Exception as e:
        raise Exception("Failed to connect to the database: " + str(e))

async def get_db_schema() -> dict:
    """
    Retrieve the complete database schema from the 'public' schema.
    Returns a dictionary with a key 'tables' mapping to table names and their columns.
    """
    conn = await get_db_connection()
    try:
        tables_query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """
        tables = await conn.fetch(tables_query)
        if not tables:
            return {"tables": {}}
        schema_dict = {}
        for record in tables:
            table_name = record["table_name"]
            columns_query = """
                SELECT column_name, data_type
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position;
            """
            columns = await conn.fetch(columns_query, table_name)
            schema_dict[table_name] = [
                {"column_name": col["column_name"], "data_type": col["data_type"]}
                for col in columns
            ]
        return {"tables": schema_dict}
    except Exception as e:
        raise Exception("Error fetching schema: " + str(e))
    finally:
        await conn.close()

async def execute_query(query: str) -> dict:
    """
    Execute a given SQL query and return the results as a dictionary.
    """
    conn = await get_db_connection()
    try:
        records = await conn.fetch(query)
        if records:
            columns = list(records[0].keys())
            rows = [list(record.values()) for record in records]
        else:
            columns, rows = [], []
        return {"columns": columns, "rows": rows}
    except Exception as e:
        raise Exception("Error executing query: " + str(e))
    finally:
        await conn.close()
