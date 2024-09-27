import configparser
import hashlib
import uuid
from typing import List

from flask import Blueprint, request, jsonify

from controller.main.main import check_credential, check_username_exists, set_error_message_response
from extensions import socketio
from model.Service.bambino_service import BambinoService
from model.Service.patologia_bambino_service import PatologiaBambinoService
from model.Service.patologia_service import PatologiaService
from model.Service.terapista_associato_service import TerapistaAssociatoService
from model.Service.user_service import UtenteService
from model.entity.bambino import Bambino
from model.entity.patologia import Patologia
from model.entity.terapista_associato import TerapistaAssociato
from model.entity.utente import Utente

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
def register(user_service: UtenteService):
    try:
        parameters = dict()
        response_copy = response.copy()
        parameters["email"] = request.json["email"]
        parameters["username"] = request.json["username"]
        parameters["password"] = request.json["password"]
        response_copy = check_credential(user_service, parameters, response_copy)
        if response_copy["error"]["number_error"] == 0:
            response_copy["response"] = {"id_utente": uuid.uuid4()}
            user_service.insert_utente(Utente(id_utente=response_copy["response"]["id_utente"],
                                              email=parameters["email"], password=parameters["password"],
                                              username=parameters["username"]))

        return response_copy
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@terapista.route('/registerchild', methods=["POST"])
def create_child(child: BambinoService, pathology: PatologiaService, user_service: UtenteService,
                 pa_bambino_service: PatologiaBambinoService, terapista_child_service: TerapistaAssociatoService):
    try:
        parameters = dict()
        response_copy = response.copy()
        response_copy["error"]["number_error"] = 0
        response_copy["error"]["message"].clear()
        parameters["email"] = request.json["email"]
        parameters["nome"] = request.json["nome"]
        parameters["cognome"] = request.json["cognome"]
        parameters["username"] = request.json["username"]
        parameters["data"] = request.json["data"]
        parameters["descrizione"] = request.json["descrizione"]
        parameters["patologie"] = request.json["patologie"]
        parameters["id_terapista"] = request.json["id_terapista"]
        parameters["validazione_terapista"] = request.json["controllo_terapista"]
        parameters["terapisti_associati"] = request.json["terapisti_associati"]
        insert_pathology(is_not_exist_pathology(parameters["patologie"], pathology), pathology)
        response_copy = check_credential(user_service, parameters, response_copy)
        if response_copy["error"]["number_error"] == 0:
            h = hashlib.new('sha256')
            h.update(f"{parameters["cognome"]}.{parameters["nome"]}".encode('ascii'))
            password = h.hexdigest()
            bambino = Bambino(id_utente=uuid.uuid4(), nome=parameters["nome"],
                              cognome=parameters["cognome"], password=password,
                              username=parameters["username"], data_nascita=parameters["data"],
                              descrizione=parameters["descrizione"], email=parameters["email"],
                              id_terapista=parameters["id_terapista"],
                              controllo_terapista=parameters["validazione_terapista"])
            child.insert_bambino(bambino)
            pa_bambino_service.insert_patologie_bambino(id_bambino=bambino.id_bambino,
                                                        patologie_bambino=parameters["patologie"])
            if parameters["terapisti_associati"]:
                insert_associaton_therapist_child(id_child=bambino.id_bambino,
                                                  list_email=parameters["terapisti_associati"],
                                                  user_service=user_service, terapista_child=terapista_child_service,
                                                  operation="insert"
                                                  )
            terapista_child_service.insert(TerapistaAssociato(bambino.id_bambino, bambino.id_terapista))
            terapisti = terapista_child_service.find_all_terapisti_associati(id_search=bambino.id_bambino,
                                                                             id_terapista=bambino.id_terapista)
            socketio.emit("message", {"operazione": "insert", **bambino.to_dict(),
                                      "terapista_associati": {email: t.to_dict() for t, email in terapisti}})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        return {"errorKey": f"not found this key: {key}"}


def is_not_exist_pathology(pathologys: list[str], pathology: PatologiaService) -> list[Patologia] | None:
    is_pathology_exist = pathology.get_find_in_list(pathologys)
    pathologys = [Patologia(nome_patologia=p.lower().capitalize()) for p in pathologys if p.lower().capitalize()
                  not in [elem.nome_patologia for elem in is_pathology_exist]]
    return pathologys if len(pathologys) != 0 else None


def insert_pathology(pathology: list[Patologia] | None, pathology_service: PatologiaService):
    if pathology:
        pathology_service.insert_patologia(pathology)


def insert_associaton_therapist_child(id_child: uuid, list_email: List[str], user_service: UtenteService,
                                      terapista_child: TerapistaAssociatoService, operation: str):
    associaton_child: list[TerapistaAssociato] = []
    if id_child:
        for el in list_email:
            id_user = user_service.find_by_email(el).id_utente
            if id_user:
                associaton_child.append(TerapistaAssociato(id_child, id_user))
        if operation.__eq__("insert"):
            terapista_child.insert(associaton_child)
        else:
            terapista_child.update(associaton_child)


@terapista.route('/pathology_list', methods=["GET"])
def pathology_list(pathology_service: PatologiaService):
    response_copy = response.copy()
    response_copy["response"] = {
        "pathology": [p.nome_patologia for p in pathology_service.get_find_all_patologia(None)]}
    return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@terapista.route('/all_email', methods=["POST"])
def get_email_terapist_list(user_service: UtenteService):
    try:
        type_user = request.json['type_user']
        response_copy = response.copy()
        email_list = user_service.find_all_email_therapist(type_user)
        if email_list:
            response_copy["response"] = {
                "email": [p[0] for p in user_service.find_all_email_therapist(type_user)]}
        else:
            response_copy["response"] = {
                "email": []
            }
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        print(key)
        return {"errorKey": f"not found this key: {key}"}


@terapista.route('/prova', methods=["GET"])
def prova(terapista_associato: TerapistaAssociatoService):
    list_terapisti = terapista_associato.find_by_email_terapista("7c88d168-e55f-43dc-9816-90e19c2e8be8")
    if list_terapisti:
        print(list_terapisti)
        print([el[0] for el in list_terapisti])
    return {}


@terapista.route('/find_child_therapist', methods=["POST"])
def find_child_therapist(
        terapista_child_service: TerapistaAssociatoService,
        bambino_service: BambinoService,
        utente_service: UtenteService):
    try:
        id_terapista = request.json['id_terapista']
        terapisti_associati = dict()
        response_copy = response.copy()
        response_copy["response"] = {"list_child": []}
        for el in terapista_child_service.find_all_by_id(id_terapista, "terapista"):
            bambino = bambino_service.get_find_all_by_id_bambino(el.idbambino)
            if bambino and isinstance(bambino, Bambino):
                terapista_child_service.find_by_email_terapista(bambino.id_bambino)
                list_terapisti = terapista_child_service.find_by_email_terapista(bambino.id_bambino)
                if list_terapisti:
                    terapisti_associati['terapista_associati'] = [el[0] for el in list_terapisti]
                    (terapisti_associati['terapista_associati'].
                     remove(utente_service.get_find_all_by_id_utente(bambino.id_terapista).email))
                response_copy["response"]["list_child"].append({**bambino.to_dict(), **terapisti_associati})
        return response_copy
    except KeyError as key:
        return {"errorKey": f"not found this key: {key}"}


@socketio.on('message')
def handle_message(message):
    print(message)


@terapista.route('/updatechild', methods=["POST"])
def update_child(child: BambinoService, user_service: UtenteService,
                 pa_bambino_service: PatologiaBambinoService,
                 terapista_child_service: TerapistaAssociatoService,
                 pathology: PatologiaService):
    try:
        parameters = dict()
        response_copy = response.copy()
        response_copy["error"]["number_error"] = 0
        response_copy["error"]["message"].clear()
        parameters["email"] = request.json["email"]
        parameters["id_bambino"] = request.json["id_bambino"]
        parameters["nome"] = request.json["nome"]
        parameters["cognome"] = request.json["cognome"]
        parameters["username"] = request.json["username"]
        parameters["data"] = request.json["data"]
        parameters["descrizione"] = request.json["descrizione"]
        parameters["patologie"] = request.json["patologie"]
        parameters["id_terapista"] = request.json["id_terapista"]
        parameters["validazione_terapista"] = request.json["controllo_terapista"]
        parameters["terapisti_associati"] = request.json["terapisti_associati"]
        parameters["update_value"] = request.json["update_value"]
        user = user_service.get_find_all_by_id_utente(parameters["id_bambino"])
        if user:
            if "Email" in parameters["update_value"]:
                _, is_email = check_username_exists(user_service, parameters["email"], "email")
                if is_email:
                    set_error_message_response(response_copy, {"email": "Esiste gia un utente con questa email"})
            if response_copy["error"]["number_error"].__eq__(0):
                bambino = Bambino(id_bambino=parameters["id_bambino"], id_utente=parameters["id_bambino"],
                                  email=parameters["email"], username=parameters["username"],
                                  controllo_terapista=parameters["validazione_terapista"],
                                  id_terapista=parameters["id_terapista"], cognome=parameters["cognome"],
                                  descrizione=parameters["descrizione"], data_nascita=parameters["data"],
                                  nome=parameters["nome"], password=user.password)
                child.update_bambino(bambino=bambino)
            if "Patologie" in parameters["update_value"]:
                insert_pathology(is_not_exist_pathology(parameters["patologie"], pathology), pathology)
                pa_bambino_service.update_patologie(parameters["id_bambino"], parameters["patologie"])
            if "Terapisti" in parameters["update_value"]:
                terapista_child_service.update_terapisti_associati(parameters["id_bambino"], parameters["id_terapista"],
                                                                   parameters["terapisti_associati"])
        terapisti = terapista_child_service.find_all_terapisti_associati(id_search=user.id_bambino,
                                                                         id_terapista=user.id_terapista)
        socketio.emit("message",
                      {"operazione": "update", **user.to_dict(),
                       "terapista_associati": {email: t.to_dict() for t, email in terapisti}})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        return {"errorKey": f"not found this key: {key}"}
