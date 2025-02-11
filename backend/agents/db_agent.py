# backend/agents/db_agent.py
import os
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic import BaseModel

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in environment variables.")

class SQLQuery(BaseModel):
    query: str

# Initialize the model with the o1-mini configuration
model = OpenAIModel("o1-mini", api_key=OPENAI_API_KEY)
agent = Agent(model, result_type=str)

parser_model = OpenAIModel("gpt-4o-mini", api_key=OPENAI_API_KEY)
parser_agent = Agent(parser_model, result_type=SQLQuery)

async def generate_sql(prompt: str) -> str:
    raw_response = await agent.run(prompt)
    parsed_response = await parser_agent.run(raw_response.data)
    return parsed_response.data.query

