import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE = os.environ.get("DATABASE")

EMAIL_ACCOUNT = os.environ.get("EMAIL_ACCOUNT")
PSW_ACCOUNT = os.environ.get("PSW_ACCOUNT")
SMTP_PORT = os.environ.get("SMTP_PORT")
SMTP_HOST = os.environ.get("SMTP_HOST")
TOKEN_CHAT_GPT = os.environ.get("TOKEN_CHAT_GPT")
