from flask import Blueprint


api = Blueprint('api', __name__)


@api.route('/')
def home_page():
    return "main"
