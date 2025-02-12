import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()
POSTGRES_CONN_STRING = os.getenv("POSTGRES_CONN_STRING")

async def get_db_connection(conn_str: str | None = None) -> asyncpg.Connection:
    connection_string = conn_str or POSTGRES_CONN_STRING
    if not connection_string:
        raise ValueError("Database connection string is required")
    
    try:
        conn = await asyncpg.connect(connection_string)
        return conn
    except asyncpg.InvalidPasswordError:
        raise ValueError("Invalid password for database user")
    except asyncpg.InvalidCatalogNameError:
        raise ValueError("Database does not exist")
    except asyncpg.PostgresConnError as e:
        if "could not translate host name" in str(e):
            raise ValueError("Could not resolve database host")
        elif "Connection refused" in str(e):
            raise ValueError("Could not connect to database server. Please check if it's running and accessible")
        raise ValueError(f"Connection error: {str(e)}")
    except Exception as e:
        raise ValueError(f"Failed to connect to database: {str(e)}")

async def get_db_schema(conn_str: str | None = None) -> dict:
    """
    Retrieve the complete database schema from the 'public' schema.
    Returns a dictionary with a key 'tables' mapping to table names and their columns.
    """
    conn = await get_db_connection(conn_str)
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

async def execute_query(query: str, conn_str: str | None = None) -> dict:
    """
    Execute a given SQL query and return the results as a dictionary.
    """
    conn = await get_db_connection(conn_str)
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
