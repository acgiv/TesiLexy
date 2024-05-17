import datetime
from flask import Blueprint, request

from model.Service.logopedista_service import LogopedistaService
from model.Service.user_service import UtenteService
from datetime import datetime

from model.dao.utente_dao import UtenteDao
from model.entity.logopedista import Logopedista

from model.entity.utente import Utente

main = Blueprint('main', __name__)


@main.route('/login', methods=["POST"])
def login(utente_service: UtenteService):
    username = request.json["username"]
    password = request.json["password"]
    result = utente_service.find_by_username_and_password(username, password)
    print(result)
    if result is not None:
        return {
            "result_connection": True,
            "username": result.username,
            "email": result.email,
        }, 200
    else:
        return {"result_connection": False}, 200


@main.route('/register', methods=["POST"])
def register(logopedista_service: LogopedistaService, utente_service: UtenteService):
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]
    response = {
        "status_code": 200,
        "error":
            {
                "number_error": 0,
                "message": []
            },
        "completed": True
    }

    logopedista = Logopedista(email=email, password=password, username=username)
    if utente_service.find_by_email(email) is not None:
        response["error"]["number_error"] += 1
        response["error"]["message"].append({"email": "Esiste gia un utente con questa email"})
        response["completed"] = False
    if utente_service.find_by_username(username) is not None:
        response["error"]["number_error"] += 1
        response["error"]["message"].append({"username": "Esiste gia un utente con questo username"})
        response["completed"] = False

    if response["error"]["number_error"] == 0:
        logopedista_service.insert_logopedista(logopedista)
    return response, 200
