import configparser
from flask import Blueprint, request, jsonify

from controller.main.main import set_error_message_response, web_log_type
from model.Service.chat_service import ChatService
from model.Service.messaggio_service import MessaggioService
from model.entity.chat import Chat
from model.entity.messaggio import Messaggio
import pprint

config = configparser.ConfigParser()
config.read(".\\gobal_variable.ini")

bambino = Blueprint('bambino', __name__)

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


@bambino.route('/find_all_chat_by_id', methods=["POST"])
def find_all_chat_by_id(chat_service: ChatService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il metodo find_all_chat_by_id()")
        results = chat_service.find_all_by_id_child(request.json['id_bambino'])
        if results:
            response_copy['response'] = {"list_chat": [result.to_dict() for result in results]}
        web_log_type(type_log='info', message="terminata la chiamata del metodo find_all_chat_by_id()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/create_chat_child', methods=["POST"])
def create_chat_child(chat_service: ChatService, message_service: MessaggioService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il metodo create_chat_child()")
        result = chat_service.insert(Chat(id_bambino=request.json['id_bambino'], id_chat=None, titolo='Nuova chat'))
        if result:
            message_service.insert(Messaggio(id_chat=result.id_chat, id_bambino=result.id_bambino,
                                             testo=config['ROBOT-MESSAGE']['description-new_chat'],
                                             tipologia="messaggio_pepper"))
            response_copy['response'] = result.to_dict()
            web_log_type(type_log='info', message="terminata la chiamata del create_chat_child()")

        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/destroy_chat_child', methods=["POST"])
def destroy_chat_child(chat_service: ChatService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il metodo destroy_chat_child()")
        result = chat_service.find_all_by_id(request.json['id_chat'])
        if result:
            chat_service.delete(result)
            web_log_type(type_log='info', message="terminata la chiamata del destroy_chat_child()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/update_chat_child', methods=["POST"])
def update_chat_child(chat_service: ChatService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il metodoupdate_chat_child()")
        result = chat_service.find_all_by_id(request.json['id_chat'])
        if result:
            result.titolo = request.json['titolo']
            chat_service.update(result)
            web_log_type(type_log='info', message="terminata la chiamata del update_chat_child()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/find_all_limit_message', methods=["POST"])
def find_all_limit_message(chat_service: MessaggioService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il find_all_limit_message()")
        result = chat_service.find_all_by_id_chat_and_child(id_chat=request.json['id_chat'],
                                                            id_child=request.json['id_bambino'],
                                                            limit=int(request.json.get('limit'))
                                                            if request.json.get('limit') is not None else None)

        if result:
            response_copy['response'] = {"message": result[0], 'number_all_message': result[1]}

        web_log_type(type_log='info', message="terminata la chiamata del find_all_limit_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/update_message_versione_corrente', methods=["POST"])
def update_message_versione_corrente(message_service: MessaggioService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="terminata la chiamata del update_message_versione_corrente()")
        message_back = message_service.find_all_by_id(id_messaggio=request.json.get('id_message_back'))
        message_now = message_service.find_all_by_id(id_messaggio=request.json.get('id_message_now'))
        pprint.pprint(request.json.get('id_message_back'))
        pprint.pprint(request.json.get('id_message_now'))
        if message_now and message_back:
            message_now.versione_corrente = 1
            message_back.versione_corrente = 0
            message_service.update(messaggio=message_now)
            message_service.update(messaggio=message_back)
        web_log_type(type_log='info', message=" fine update_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/insert_message', methods=["POST"])
def insert_message(chat_service: MessaggioService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il insert_message()")
        result = chat_service.insert(messaggio=Messaggio(id_chat=request.json['id_chat'],
                                                         id_bambino=request.json['id_bambino'],
                                                         tipologia=request.json['tipologia'],
                                                         testo=request.json['testo']))
        if result:
            response_copy['response'] = {"message": result.to_dict()}
        web_log_type(type_log='info', message="terminata la chiamata del insert_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
