import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE = os.environ.get("DATABASE")
