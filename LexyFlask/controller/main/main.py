import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTP
from configuration.config import SMTP_HOST, SMTP_PORT, EMAIL_ACCOUNT, PSW_ACCOUNT
from flask import Blueprint, request, jsonify
from model.Service.user_service import UtenteService
import configparser


config = configparser.ConfigParser()
config.read(".\\gobal_variable.ini")

main = Blueprint('main', __name__)

response = {
    "status_code": 200,
    "response": None,
    "error":
        {
            "number_error": 0,
            "message": []
        },
    "completed": True
}


@main.route('/user', methods=['GET'])
def user(utente_service: UtenteService):
    print(utente_service.get_find_all_utente(2))
    return {"result_connection": False}


@main.route('/login', methods=["POST"])
def login(utente_service: UtenteService):
    response_copy = response.copy()
    try:
        username = request.json["username"]
        password = request.json["password"]
        result = utente_service.find_by_username_and_password(username, password)
        print(result)
        if result is not None:
            response_copy["response"] = {
                                         "id_utente": result.id_utente,
                                         "username": result.username,
                                         "email": result.email,
                                         "ruolo": result.tipologia,
                                         "result_connection": True,
                                         }
            return response_copy
        else:
            response_copy["response"] = {"result_connection": False}
            return response_copy
    except KeyError as key:
        set_error_message_response(response_copy, {"errorKey": f"not found this key: {key}"})
        return


@main.route('/sendemail', methods=["POST"])
def send_email():
    try:
        email = request.json["email"]
        smtp, msg = connect_smtp(email)
        code_confirm = ''.join([str(random.randint(1, 9)) for _ in range(6)])
        body = f"Usa  {code_confirm} come codice di sicurezza per recuperare la password."
        msg.attach(MIMEText(body, 'plain'))
        smtp.sendmail(msg['From'], msg['To'], msg.as_string())
        return jsonify(args={"code": code_confirm}, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@main.route('/checkEmail', methods=["POST"])
def check_email(utente: UtenteService):
    try:
        email = request.json["email"]
        result, is_email = check_username_exists(utente, email, "email")

        if is_email:
            result2 = {**result, "found": "YES"}
            return jsonify(args=result2, status=200, mimetype=config["REQUEST"]["content_type"])
        else:
            return jsonify(args={"found": "NO", 'id_utente': 0, 'username': '', 'email': ''}, status=200,
                           mimetype='application/json')
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@main.route('/changePassword', methods=["POST"])
def change_password(utente: UtenteService):
    try:
        email = request.json["email"]
        password = request.json["password"]
        result = utente.find_by_email(email)
        if result:
            result.password = password
            utente.update_utente(result)
            return jsonify(args={"change": True}, status=200, mimetype='application/json')
        else:
            return jsonify(args={"change": False}, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        return {"errorKey": f"not found this key: {key}"}


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


def check_username_exists(user_service: UtenteService, parameter: str, select_type: str):
    result = {"result": None}
    if select_type.__eq__('email'):
        result["result"] = user_service.find_by_email(parameter)
    elif select_type.__eq__('username'):
        result["result"] = user_service.find_by_username(parameter)
    if result["result"]:
        return result["result"].to_dict(), True
    return None, False


def check_credential(user_service: UtenteService, parameter: dict, response_request: dict):
    print(parameter["email"])
    _, is_email = check_username_exists(user_service, parameter["email"], "email")
    if is_email:
        set_error_message_response(response_request, {"email": "Esiste gia un utente con questa email"})
    _, is_username = check_username_exists(user_service, parameter["username"], "username")
    if is_username:
        set_error_message_response(response_request, {"username": "Esiste gia un utente con questo username"})
    return response_request


def set_error_message_response(response_request: dict, message_respose: dict):
    response_request["error"]["number_error"] += 1
    response_request["error"]["message"].append(message_respose)
    response_request["completed"] = False
