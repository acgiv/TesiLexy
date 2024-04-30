from logging.config import dictConfig

from flask_cors import CORS
from flask_injector import FlaskInjector

from configuration.logger import LOGGING_CONFIG
from flask import Flask
from configuration.config import DATABASE
from extensions import db, ma
from model import database
from model.Service.user_service import UtenteService
from model.dao.chat_dao import ChatDao
from model.dao.label_dao import LabelDao
from model.dao.logopedista_dao import LogopedistaDao
from controller.admin.main import main
from controller.api.api import api

import logging

from model.dao.messaggio_dao import MessaggioDao
from model.dao.utente_dao import UtenteDao
from model.dao.versione_messaggio_dao import VersioneMessaggioDao


# Configurazione della dependency injection
def configure(binder):
    binder.bind(ChatDao)
    binder.bind(LogopedistaDao)
    binder.bind(UtenteDao)
    binder.bind(MessaggioDao)
    binder.bind(VersioneMessaggioDao)
    binder.bind(UtenteService)
    binder.bind(LabelDao)
    binder.bind(UtenteService)


def create_app():
    app = Flask(__name__, static_folder='static')
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['LOGGING_CONFIG'] = LOGGING_CONFIG

    db.init_app(app)
    ma.init_app(app)

    logging.config.dictConfig(app.config['LOGGING_CONFIG'])

    # Crea un logger personalizzato per l'applicazione
    app.api_logger = logging.getLogger('api_logger')
    app.web_logger = logging.getLogger('web_logger')

    app.register_blueprint(main, url_prefix='/')
    app.register_blueprint(api, url_prefix='/api')

    FlaskInjector(app=app, modules=[configure])

    with app.app_context():
        #database.drop_all_table(db)
        database.create_table(db)

    return app
