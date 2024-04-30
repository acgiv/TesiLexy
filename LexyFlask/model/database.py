from flask import current_app
from extensions import ma


class UtenteSchema(ma.Schema):
    class Meta:
        fields = ('idutente', 'username', 'password', 'email', 'data_nascita', 'sesso')


class LogopedistaSchema(ma.Schema):
    class Meta:
        fields = ('idlogopedista',)


class LabelSchema(ma.Schema):
    class Meta:
        fields = ('idlabel', 'label', 'valore')


class ChatSchema(ma.Schema):
    class Meta:
        fields = ('idchat', 'idpersona', 'titolo')


class MessaggioSchema(ma.Schema):
    class Meta:
        fields = ('idmessaggio', 'idchat', 'idpersona', 'testo', 'datacreazione',
                  'datamodifica', 'numeroversionimessaggio')


class VersioneMessaggioSchema(ma.Schema):
    class Meta:
        fields = ('idversionemessaggio', 'idmessaggio', 'testomessaggioversione', 'testo',
                  'datacreazione', 'modifica_messaggio')


utente_schema = UtenteSchema()
utenti_schema = UtenteSchema(many=True)

logopedista_schema = LogopedistaSchema()
logopedisti_schema = LogopedistaSchema(many=True)


label_Schema = LabelSchema()
label_Schemas = LabelSchema(many=True)

chat_Schema = ChatSchema()
chat_Schemas = ChatSchema(many=True)

messaggio_Schema = MessaggioSchema()
messaggio_Schemas = MessaggioSchema(many=True)

versione_messaggio_schema = VersioneMessaggioSchema()
versione_messaggio_schemas = VersioneMessaggioSchema(many=True)


def create_table(db):
    current_app.web_logger.info("Database creato con successo")
    db.create_all()


def drop_all_table(db):
    current_app.web_logger.info("Database Cancellato con successo")
    db.drop_all()
