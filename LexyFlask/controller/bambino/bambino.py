import configparser
from flask import Blueprint, request, jsonify

from controller.main.main import set_error_message_response, web_log_type
from model.Service.bambino_service import BambinoService
from model.Service.bambino_testo_service import BambinoTestoService
from model.Service.chat_service import ChatService
from model.Service.messaggio_service import MessaggioService
from model.Service.patologia_bambino_service import PatologiaBambinoService
from model.Service.patologia_service import PatologiaService
from model.Service.testo_service import TestoOriginaleService
from model.entity.chat import Chat
from model.entity.messaggio import Messaggio
import pprint
from openai import OpenAI
from configuration.config import TOKEN_CHAT_GPT
from datetime import datetime

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
            massimo_message = message_service.trova_max_index()
            message_service.insert(Messaggio(id_chat=result.id_chat, id_bambino=result.id_bambino,
                                             testo=config['ROBOT-MESSAGE']['description-new_chat'],
                                             tipologia="messaggio_pepper", index_message=massimo_message
                                             ))
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
        web_log_type(type_log='info', message="Avviata la  chiamata del update_message_versione_corrente()")
        message_back = message_service.find_all_by_id(id_messaggio=request.json.get('id_message_back'))
        message_now = message_service.find_all_by_id(id_messaggio=request.json.get('id_message_now'))
        if message_now and message_back:
            message_now.versione_corrente = 1
            message_back.versione_corrente = 0
            message_service.update(messaggio=message_now)
            message_service.update(messaggio=message_back)
            response_copy['response'] = {'message': message_now.to_dict()}
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
                                                         testo=request.json['testo'],
                                                         index_message=chat_service.trova_max_index()))
        if result:
            response_copy['response'] = {"message": result.to_dict()}
        web_log_type(type_log='info', message="terminata la chiamata del insert_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/respost_chat_gpt', methods=["POST"])
def respost_chat_gpt(bambino_testo: BambinoTestoService, testo_service: TestoOriginaleService,
                     message_service: MessaggioService, bambino_service: BambinoService,
                     patologia_service: PatologiaService, patologiabambino_service: PatologiaBambinoService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Chiamato il respost_chat_gpt()")
        massimo_message = message_service.trova_max_index()
        testo = genera_testo_with_chat_gpt(bambino_testo, testo_service,
                                           patologia_service, patologiabambino_service,
                                           bambino_service,
                                           request.json['testo_da_spiegare'])
        message = message_service.insert(
            Messaggio(id_chat=request.json['id_chat'], id_bambino=request.json['id_bambino'],
                      testo=testo,
                      tipologia="messaggio_pepper",
                      index_message=massimo_message + 1
                      ))

        response_copy["response"] = {"message": message.to_dict(is_text_list=True)}
        web_log_type(type_log='info', message="terminata la chiamata del respost_chat_gpt()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


def genera_testo_with_chat_gpt(bambino_testo: BambinoTestoService, testo_service: TestoOriginaleService,
                               patologia_service: PatologiaService, patologiabambino_service: PatologiaBambinoService,
                               bambino_service: BambinoService, testo: str
                               ):
    bam = bambino_service.get_find_all_by_id_bambino(id_bambino=request.json['id_bambino'])
    bambino_testi = bambino_testo.find_by_idbambino(bam.id_bambino)
    patologie_bambino = trova_patologie(patologia_service, patologiabambino_service, bam.id_bambino)
    lista_testi = list()
    if bambino_testi:
        for el in bambino_testi:
            idtesto = bambino_testo.find_by_bambino_and_testo(bam.id_bambino, int(el.idtesto)).idtesto
            testo_trovato = testo_service.find_by_id(id_testo=int(idtesto))
            lista_testi.append((testo_service.find_by_id(testo_trovato.id_testo_spiegato).testo,
                                testo_trovato.testo))
    client = OpenAI(api_key=TOKEN_CHAT_GPT)
    eta = datetime.now().year - bam.data_nascita.year
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=set_message_chat_gpt(lista_testi, testo, eta, patologie_bambino),
        temperature=0.4,
    )
    return completion.choices[0].message.content


def trova_patologie(patologia_service: PatologiaService, patologiabambino_service: PatologiaBambinoService,
                    id_bambino: str):
    lista_patologie = patologiabambino_service.get_find_by_id_bambino(id_bambino=id_bambino, limit=None)
    patologie = list()
    if lista_patologie is not None:
        for pat_bamb in lista_patologie:
            pat = patologia_service.get_find_all_by_id_patologia(pat_bamb.idpatologia)
            if pat:
                patologie.append(pat.nome_patologia)
    return patologie


def set_message_chat_gpt(lista: list, testo_da_spiegare: str, eta: int, patologie_bambino: list):
    message = list()
    message.append(
        {"role": "system",
         "content": "Sei un terapista specializzato nell'aiutare i bambini con difficoltà di apprendimento a "
                    f"comprendere i testi. Il bambino che stai aiutando ha {eta} anni ed è affetto \
                     da: '{", ".join(patologie_bambino)}'. Il tuo compito è semplificare i testi per lui."
                    f" Ecco come dovresti procedere:\
                    1. Mantieni il significato originale del testo senza aggiungere nuove informazioni. \
                    2. Semplifica le parole e le frasi per renderle più comprensibili, usando un linguaggio \
                    adatto a un bambino di {eta} anni. \
                    3. Usa frasi brevi e chiare perchè il testo deve essere facile da leggere e capire. \
                    4. Se ci sono termini tecnici o complessi, spiegali con esempi semplici tra parentesi \
                    5. Evita di usare frasi lunghe o parole complesse. \
                    6. Ricorda che il bambino ha: '{", ".join(patologie_bambino)}"
         }
    )
    for el in lista:
        message.append({"role": "user", "content": f"{el[0]}"})
        message.append({"role": "assistant", "content": f"{el[1]}"})
        message.append({"role": "user", "content": f"{testo_da_spiegare}"})
    return message


@bambino.route('/update_message', methods=["POST"])
def update_message(message_service: MessaggioService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Avviata la chiamata del update_message()")
        message = message_service.find_all_by_id(id_messaggio=request.json.get('id_messaggio'))
        if message:
            fields_to_update = {
                "like": "like",
                "index_message": "index_message",
                "testo": "testo",
                "data_creazione": "data_creazione",
                "versione_messaggio": "versione_messaggio",
            }
            for key, value in request.json.items():
                if key in fields_to_update:
                    setattr(message, fields_to_update[key], value)
            message_service.update(message)
        web_log_type(type_log='info', message=" termiaata la chiamata update_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])


@bambino.route('/reload_message', methods=["POST"])
def reload_message(message_service: MessaggioService, bambino_testo: BambinoTestoService,
                   testo_service: TestoOriginaleService,
                   patologia_service: PatologiaService, patologiabambino_service: PatologiaBambinoService,
                   bambino_service: BambinoService):
    response_copy = response.copy()
    try:
        web_log_type(type_log='info', message="Avviata la chiamata del update_message()")
        message = message_service.find_all_by_id(id_messaggio=request.json.get('id_messaggio_active'))
        testo = genera_testo_with_chat_gpt(bambino_testo, testo_service,
                                           patologia_service, patologiabambino_service,
                                           bambino_service, request.json.get('testo_user')
                                           )
        message.versione_corrente = 0
        message_service.update(message)
        massimo_message = message_service.trova_max_index()
        message_new = Messaggio(id_chat=message.id_chat, id_bambino=message.id_bambino, testo=testo,
                                index_message=massimo_message, tipologia="messaggio_pepper",
                                numero_versioni_messaggio=1, versione_messaggio=request.json.get('id_message_reload'))
        message_service.insert(message_new)
        response_copy['response'] = {"message": message_new.to_dict(is_text_list=True)}
        web_log_type(type_log='info', message=" termiaata la chiamata update_message()")
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
    except KeyError as key:
        web_log_type(type_log='error', message=f"Errore non è stata trovata questa chiave {str(key)} nel body")
        set_error_message_response(response_copy, {"KeyError": f"Errore non è stata"
                                                               f" trovata questa chiave {str(key)} nel body"})
        return jsonify(args=response_copy, status=200, mimetype=config["REQUEST"]["content_type"])
