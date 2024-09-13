from flask import Blueprint, request, jsonify
from model.Service.bambino_service import BambinoService
from model.Service.patologia_service import PatologiaService
from model.Service.terapista_service import TerapistaService
from model.Service.user_service import UtenteService
from model.entity.patologia import Patologia
from controller.main.main import check_credential
import configparser

from model.entity.terapista import Terapista

config = configparser.ConfigParser()
config.read(".\\gobal_variable.ini")

terapista = Blueprint('terapista', __name__)

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


@terapista.route('/register', methods=["POST"])
def register(terapista_service: TerapistaService, user_service: UtenteService):
    try:
        parameters = dict()
        response_copy = response.copy()
        parameters["email"] = request.json["email"]
        parameters["username"] = request.json["username"]
        parameters["password"] = request.json["password"]
        response_copy = check_credential(user_service, parameters, response_copy)
        if response_copy["error"]["number_error"] == 0:
            terapista_service.insert_terapista(Terapista(email=parameters["email"], password=parameters["password"],
                                                         username=parameters["username"]))
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@terapista.route('/registerchild', methods=["POST"])
def create_child(child: BambinoService, pathology: PatologiaService, user_service: UtenteService):
    try:
        parameters = dict()
        response_copy = response.copy()
        parameters["email"] = request.json["email"]
        parameters["nome"] = request.json["nome"]
        parameters["cognome"] = request.json["cognome"]
        parameters["username"] = request.json["username"]
        parameters["data"] = request.json["data"]
        parameters["descrizione"] = request.json["descrizione"]
        parameters["patologie"] = request.json["patologie"]
        insert_pathology(is_not_exist_pathology(parameters["patologie"], pathology), pathology)
        response_copy = check_credential(user_service, parameters, response_copy)
        print(response_copy)
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@terapista.route('/pathology_list', methods=["GET"])
def pathology_list(pathology_service: PatologiaService):
    response_copy = response.copy()
    response_copy["response"] = {
        "pathology": [p.nome_patologia for p in pathology_service.get_find_all_patologia(None)]}
    return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


def is_not_exist_pathology(pathologys: list[str], pathology: PatologiaService) -> list[Patologia] | None:
    is_pathology_exist = pathology.get_find_in_list(pathologys)
    pathologys = [Patologia(nome_patologia=p.lower().capitalize()) for p in pathologys if p.lower().capitalize()
                  not in [elem.nome_patologia for elem in is_pathology_exist]]
    return pathologys if len(pathologys) != 0 else None


def insert_pathology(pathology: list[Patologia] | None, pathology_service: PatologiaService):
    if pathology:
        pathology_service.insert_patologia(pathology)
