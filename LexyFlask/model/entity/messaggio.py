import uuid
from uuid import UUID

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, CHAR, PrimaryKeyConstraint
from sqlalchemy.orm import relationship

from extensions import db
from datetime import datetime


class Messaggio(db.Model):
    __tablename__ = "messaggio"
    _id_messaggio = Column('idmessaggio', CHAR(36), primary_key=True)
    _id_chat = Column('idchat', CHAR(36), ForeignKey('chat.idchat', ondelete='CASCADE'), nullable=False,
                      primary_key=True)
    _id_bambino = Column('idbambino', CHAR(36), ForeignKey('bambino.idbambino', ondelete='CASCADE'), nullable=False,
                         primary_key=True)
    _testo = Column('testo', String(255), nullable=False)
    _data_creazione = Column('datacreazione', DateTime, nullable=False, default=datetime.utcnow)
    _versione_corrente = Column('versione_corrente', Integer, default=0)
    _tipologia = Column('tipologia', String(20), default='messaggio')
    _versione_messaggio = Column('versione_messaggio', CHAR(36), ForeignKey('messaggio.idmessaggio'))

    __table_args__ = (
        PrimaryKeyConstraint('idmessaggio', 'idchat', 'idbambino'),
    )

    _utente = db.relationship("Bambino", back_populates="_messaggi")
    _chat = db.relationship("Chat", back_populates="_messaggi")

    __mapper_args__ = {
        'polymorphic_on': _tipologia,
        'polymorphic_identity': 'messaggio'
    }

    def __init__(self, id_chat: str, id_bambino: str, testo: str,
                 numero_versioni_messaggio: int = 0, tipologia: str = None):
        self._id_messaggio = uuid.uuid4()
        self._id_chat = id_chat
        self._id_bambino = id_bambino
        self._testo = testo
        self._numero_versioni_messaggio = numero_versioni_messaggio
        if tipologia:
            self._tipologia = tipologia

    @property
    def id_messaggio(self) -> UUID:
        return self._id_messaggio

    @id_messaggio.setter
    def id_messaggio(self, id_messaggio: str) -> None:
        self._id_messaggio = id_messaggio

    @property
    def id_chat(self) -> str:
        return self._id_chat

    @id_chat.setter
    def id_chat(self, id_chat: int) -> None:
        self._id_chat = id_chat

    @property
    def id_bambino(self) -> uuid:
        return self._id_bambino

    @id_bambino.setter
    def id_bambino(self, id_bambino: uuid) -> None:
        self._id_bambino = id_bambino

    @property
    def testo(self) -> str:
        return self._testo

    @testo.setter
    def testo(self, testo: str) -> None:
        self._testo = testo

    @property
    def data_creazione(self) -> datetime:
        return self._data_creazione

    @data_creazione.setter
    def data_creazione(self, data_creazione: datetime) -> None:
        self._data_creazione = data_creazione

    @property
    def versione_messaggio(self) -> str:
        return self.versione_messaggio

    @versione_messaggio.setter
    def versione_messaggio(self, versione_messaggio: str) -> None:
        self._versione_messaggio = versione_messaggio

    @id_messaggio.deleter
    def id_messaggio(self) -> None:
        del self._id_messaggio

    @id_chat.deleter
    def id_chat(self) -> None:
        del self._id_chat

    @id_bambino.deleter
    def id_bambino(self) -> None:
        del self._id_bambino

    @testo.deleter
    def testo(self) -> None:
        del self._testo

    @data_creazione.deleter
    def data_creazione(self) -> None:
        del self._data_creazione

    @versione_messaggio.deleter
    def versione_messaggio(self) -> None:
        del self._versione_messaggio

    def __str__(self):
        return (f"id_messaggio: {self._id_messaggio}, id_chat: {self._id_chat}, id_bambino: {self._id_bambino},"
                f" testo: {self._testo}, data_creazione: {self._data_creazione},"
                f"  numero_versioni_messaggio: {self._versione_messaggio}")

    def __repr__(self):
        return (f"<id_messaggio: {self._id_messaggio},"
                f" id_chat: {self._id_chat},  id_bambino: {self._id_bambino},"
                f" testo: {self._testo}, data_creazione: {self._data_creazione}, "
                f" numero_versioni_messaggio: {self._versione_messaggio}>")


class MessaggioPepper(Messaggio):
    __mapper_args__ = {
        'polymorphic_identity': 'messaggio_pepper'
    }
