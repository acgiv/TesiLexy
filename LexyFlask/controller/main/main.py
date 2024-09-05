import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTP
from configuration.config import SMTP_HOST, SMTP_PORT, EMAIL_ACCOUNT, PSW_ACCOUNT
from flask import Blueprint, request, jsonify

from model.Service.bambino_service import BambinoService
from model.Service.logopedista_service import LogopedistaService
from model.Service.patologia_service import PatologiaService
from model.Service.user_service import UtenteService
from model.entity.bambino import Bambino
from model.entity.logopedista import Logopedista

main = Blueprint('main', __name__)


@main.route('/user', methods=['GET'])
def user(utente_service: UtenteService):
    print(utente_service.get_find_all_utente(2))
    return {"result_connection": False}


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


@main.route('/sendemail', methods=["POST"])
def send_email():
    email = request.json["email"]
    smtp, msg = connect_smtp(email)
    code_confirm = ''.join([str(random.randint(1, 9)) for _ in range(6)])
    body = f"Usa  {code_confirm} come codice di sicurezza per recuperare la password."
    msg.attach(MIMEText(body, 'plain'))
    smtp.sendmail(msg['From'], msg['To'], msg.as_string())
    return jsonify(args={"code": code_confirm}, status=200, mimetype='application/json')


def connect_smtp(email) -> tuple[SMTP, MIMEMultipart]:
    """
       Connette al server SMTP in modo sicuro utilizzando SMTP_SSL.

       Questo metodo stabilisce una connessione sicura al server SMTP
       utilizzando il protocollo SMTP_SSL.

       :return: Un oggetto SMTP se la connessione ha successo, altrimenti None.
       :rtype: Smtplib.SMTP_SSL o None
       """
    smtp = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    smtp.starttls()
    if smtp.login(EMAIL_ACCOUNT, PSW_ACCOUNT).__eq__(235):
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ACCOUNT  # Imposta il mittente dell'email
        msg['To'] = email  # Imposta il destinatario dell'email
        msg['Subject'] = 'Recupero password'  # Imposta l'oggetto dell'email
        return smtp, msg


@main.route('/checkEmail', methods=["POST"])
def check_email(utente: UtenteService):
    email = request.json["email"]
    result = utente.find_by_email(email)
    print(result)
    if result:
        respost = result.to_dict
        respost["found"] = "YES"
        return jsonify(args=respost, status=200, mimetype='application/json')
    else:
        return jsonify(args={"found": "NO", 'id_utente': 0, 'username': '', 'email': ''}, status=200,
                       mimetype='application/json')


@main.route('/changePassword', methods=["POST"])
def change_password(utente: UtenteService):
    email = request.json["email"]
    password = request.json["password"]
    result = utente.find_by_email(email)
    if result:
        result.password = password
        utente.update_utente(result)
        return jsonify(args={"change": True}, status=200, mimetype='application/json')
    else:
        return jsonify(args={"change": False}, status=200, mimetype='application/json')


@main.route('/createbambino', methods=["POST"])
def create_bambino(bambinos: BambinoService, patologia: PatologiaService):
    bambino = Bambino(username="a.mario1", cognome="rossi", nome="mario", email="a.mario1@gmail.com",
                      password="giovanni99.", data_nascita="18/12/!999", descrizione=" il bambino è scemo")
    patologie = patologia.get_find_all_patologia(limit=None)
    print(patologie)
    bambino.patologie.append(patologie[2])
    bambino.patologie.append(patologie[3])
    print(bambino)
    bambinos.insert_bambino(bambino)
    return {"prova": "ok"}
