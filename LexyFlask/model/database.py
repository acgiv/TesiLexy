from flask import current_app
from extensions import ma


class UtenteSchema(ma.Schema):
    class Meta:
        fields = ('idutente', 'username', 'password', 'email')


class LogopedistaSchema(UtenteSchema):
    class Meta(UtenteSchema.Meta):
        fields = UtenteSchema.Meta.fields + ('idlogopedista',)


class BambinoSchema(UtenteSchema):
    class Meta(UtenteSchema.Meta):
        fields = UtenteSchema.Meta.fields + ('idbambino', 'nome', 'cognome', 'dataNascita', 'descrizione', 'patologia' )


class PatologiaSchema(UtenteSchema):
    class Meta:
        fields = UtenteSchema.Meta.fields + ('idpatologia', 'nome')


class PatologiaBambinoSchema(UtenteSchema):
    class Meta:
        fields = ('idbambino','idpatologia')


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

bambino_schema = BambinoSchema()
bambino_schemas = BambinoSchema(many=True)

patologia_schema = PatologiaSchema()
patologia_schemas = PatologiaSchema(many=True)

patologia_bambino_schema = PatologiaBambinoSchema()
patologia_bambino_schemas = PatologiaBambinoSchema(many=True)

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
