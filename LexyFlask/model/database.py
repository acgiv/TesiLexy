from flask import current_app
from extensions import ma
from model.entity.terapista_associato import TerapistaAssociato


class UtenteSchema(ma.Schema):
    class Meta:
        fields = ('idutente', 'username', 'password', 'email')


class BambinoSchema(UtenteSchema):
    class Meta(UtenteSchema.Meta):
        fields = UtenteSchema.Meta.fields + ('idbambino', 'nome', 'cognome', 'dataNascita', 'descrizione', 'patologia')


class PatologiaSchema(ma.Schema):
    class Meta:
        fields = UtenteSchema.Meta.fields + ('idpatologia', 'nome')


class PatologiaBambinoSchema(UtenteSchema):
    class Meta:
        fields = ('idbambino', 'idpatologia')


class TerapistaAssociatoSchema(ma.Schema):
    class Meta:
        fields = ('idbambino', 'idterapista')


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


class TipoloigiaTestoSchema(ma.Schema):
    class Meta:
        fields = UtenteSchema.Meta.fields + ('idtipologia', 'nome')


class TestoOriginaleSchema(ma.Schema):
    class Meta:
        fields = ('idtesto', 'titolo', 'testo', 'eta_riferimento', 'tipologia', "tiologia_testo")


utente_schema = UtenteSchema()
utenti_schema = UtenteSchema(many=True)

bambino_schema = BambinoSchema()
bambino_schemas = BambinoSchema(many=True)

patologia_schema = PatologiaSchema()
patologia_schemas = PatologiaSchema(many=True)

patologia_bambino_schema = PatologiaBambinoSchema()
patologia_bambino_schemas = PatologiaBambinoSchema(many=True)

terapista_associato_schema = TerapistaAssociatoSchema()
terapista_associato_schemas = TerapistaAssociatoSchema(many=True)

label_Schema = LabelSchema()
label_Schemas = LabelSchema(many=True)

chat_Schema = ChatSchema()
chat_Schemas = ChatSchema(many=True)

messaggio_Schema = MessaggioSchema()
messaggio_Schemas = MessaggioSchema(many=True)

versione_messaggio_schema = VersioneMessaggioSchema()
versione_messaggio_schemas = VersioneMessaggioSchema(many=True)

tipologia_testo = TipoloigiaTestoSchema()
tipologia_testos = TipoloigiaTestoSchema(many=True)

testo_schema = TestoOriginaleSchema()
testoschemas = TestoOriginaleSchema(many=True)


def create_table(db):
    current_app.web_logger.info("Database creato con successo")
    db.create_all()


def drop_all_table(db):
    current_app.web_logger.info("Database Cancellato con successo")
    db.drop_all()
