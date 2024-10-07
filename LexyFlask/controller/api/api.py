from flask import Blueprint, jsonify, current_app, request

from model.Service.bambino_testo_service import BambinoTestoService
from model.Service.terapista_associato_service import TerapistaAssociatoService
from controller.main.main import set_error_message_response
import configparser

from model.Service.testo_service import TestoOriginaleService
from model.Service.tipologiatesto_service import TipologiaTestoService
from model.Service.user_service import UtenteService

config = configparser.ConfigParser()
config.read(".\\gobal_variable.ini")

api = Blueprint('api', __name__)

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


def log_type(type_log: str, message: str):
    if hasattr(current_app, 'api_logger'):
        if type_log.__eq__("error"):
            current_app.api_logger.error(message)
        elif type_log.__eq__("info"):
            current_app.api_logger.info(message)
        elif type_log.__eq__("critical"):
            current_app.api_logger.critical(message)
        else:
            current_app.api_logger.worning(message)


@api.route('/find_all_user_child_by_therapist', methods=["POST"])
def find_all_user_child_by_therapist(therapist_associate_service: TerapistaAssociatoService):
    log_type("info", "Avviato metodo find_all_user_child_by_therapist()")
    response_copy = response.copy()
    try:
        results = therapist_associate_service.find_all_user_child_by_therapist(request.json['id_terapista'])
        response_copy["response"] = {"child": [email for (email,) in results]}
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        log_type("error", f"Errore non è stata trovata questa chiave nella rwquest.json: {str(key)}")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@api.route('/find_all_test', methods=["POST"])
def find_all_text(testo_service: TestoOriginaleService,
                  tipologia_service: TipologiaTestoService,
                  bambnino_testo_service: BambinoTestoService,
                  user_service: UtenteService):
    response_copy = response.copy()
    try:
        lista = testo_service.find_by_tipologia(request.json['tipologia'], request.json['limite'])
        if lista:
            dic = {"text": [el.to_dict() for el in lista]}
            for el in dic['text']:
                nome = tipologia_service.find_all_by_id(el['id_tipologia_testo']).nome
                if nome:
                    el['materia'] = nome
                if request.json['tipologia'] == "testo_spiegato":
                    el["child"] = list()
                    id_bambini = bambnino_testo_service.find_by_idtesto(el["id_testo"])
                    if id_bambini:
                        for bambino in id_bambini:
                            user = user_service.get_find_all_by_id_utente(str(bambino.idbambino))
                            if user:
                                el["child"].append(user.username)
            response_copy["response"] = dic
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        log_type("error", f"Errore non è stata trovata questa chiave nella rwquest.json: {str(key)}")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
