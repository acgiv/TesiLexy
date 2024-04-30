from flask import Blueprint


api = Blueprint('controller', __name__)


@api.route('/')
def home_page():
    return "main"
