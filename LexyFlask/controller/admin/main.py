import datetime
from flask import Blueprint, request, current_app

from model.Service.user_service import UtenteService
from model.dao.chat_dao import ChatDao
from model.dao.messaggio_dao import MessaggioDao
from model.dao.logopedista_dao import LogopedistaDao
from datetime import datetime

from model.dao.utente_dao import UtenteDao

from model.entity.utente import Utente

main = Blueprint('main', __name__)


@main.route('/')
def home_page(utente_dao: UtenteDao):

    user1 = Utente(id_utente= None, username="a.cecinato1",
                 data_nascita=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), sesso="maschio", password="password",
                 email="a.cecinato1@lexy.com")

    print(user1.sesso)
    utente_dao.insert(user1)
    print(utente_dao.find_all_by_id(1))

    return "ciao"


@main.route('/login', methods=["POST"])
def login(utente_service: UtenteService):
    username = request.json["username"]
    password = request.json["password"]
    result = utente_service.find_by_username_and_password(username, password)
    if result is not None:
        return {"result_connection": True }
    else:
        return {"result_connection": False}




