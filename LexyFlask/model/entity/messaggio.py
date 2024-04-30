from sqlalchemy import Column, String, Integer, ForeignKey, DateTime

from extensions import db
from datetime import datetime


class Messaggio(db.Model):
    __tablename__ = "messaggio"
    _id_messaggio = Column('idmessaggio', Integer, primary_key=True, autoincrement=True)
    _id_chat = Column('idchat', Integer, ForeignKey('chat.idchat', ondelete='CASCADE'), nullable=False)
    _id_utente = Column('idutente', Integer, ForeignKey('utente.idutente', ondelete='CASCADE'), nullable=False)
    _testo = Column('testo', String(255), nullable=False)
    _data_creazione = Column('datacreazione', DateTime, nullable=False)
    _data_modifica = Column('datamodifica', DateTime)
    _numero_versioni_messaggio = Column('numeroversionimessaggio', Integer, default=0)

    _priority_id_messaggio = 1
    _priority_id_chat = 2
    _priority_id_utente = 3
    _priority_testo = 4
    _priority_data_creazione = 5
    _priority_data_modifica = 6
    _priority_numero_versioni_messaggio = 7

    _utente = db.relationship("Utente", back_populates="_messaggi")
    _chat = db.relationship("Chat", back_populates="_messaggi")
    _versioni_messaggi = db.relationship("VersioneMessaggio",  back_populates="_messaggi", cascade="all, delete-orphan")

    def __init__(self, id_chat: int, id_utente: int, testo: str, data_creazione: datetime,
                 data_modifica: datetime, numero_versioni_messaggio: int = 0):
        self._id_chat = id_chat
        self._id_utente = id_utente
        self._testo = testo
        self._data_creazione = data_creazione
        self._data_modifica = data_modifica
        self._numero_versioni_messaggio = numero_versioni_messaggio

    @property
    def id_messaggio(self) -> int:
        return self._id_messaggio

    @id_messaggio.setter
    def id_messaggio(self, id_messaggio: int) -> None:
        self._id_messaggio = id_messaggio

    @property
    def id_chat(self) -> int:
        return self._id_chat

    @id_chat.setter
    def id_chat(self, id_chat: int) -> None:
        self._id_chat = id_chat

    @property
    def id_utente(self) -> int:
        return self._id_utente

    @id_utente.setter
    def id_utente(self, id_utente: int) -> None:
        self._id_utente = id_utente

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
    def data_modifica(self) -> datetime:
        return self._data_modifica

    @data_modifica.setter
    def data_modifica(self, data_modifica: datetime) -> None:
        self._data_modifica = data_modifica

    @property
    def numero_versioni_messaggio(self) -> int:
        return self._numero_versioni_messaggio

    @numero_versioni_messaggio.setter
    def numero_versioni_messaggio(self, numero_versioni_messaggio: int) -> None:
        self._numero_versioni_messaggio = numero_versioni_messaggio

    @id_messaggio.deleter
    def id_messaggio(self) -> None:
        del self._id_messaggio

    @id_chat.deleter
    def id_chat(self) -> None:
        del self._id_chat

    @id_utente.deleter
    def id_utente(self) -> None:
        del self._id_utente

    @testo.deleter
    def testo(self) -> None:
        del self._testo

    @data_creazione.deleter
    def data_creazione(self) -> None:
        del self._data_creazione

    @data_modifica.deleter
    def data_modifica(self) -> None:
        del self._data_modifica

    @numero_versioni_messaggio.deleter
    def numero_versioni_messaggio(self) -> None:
        del self._numero_versioni_messaggio

    def __str__(self):
        return f"id_messaggio: {self._id_messaggio}, id_chat: {self._id_chat}, id_utente: {self._id_utente}, testo: {self._testo}, data_creazione: {self._data_creazione}, data_modifica: {self._data_modifica}, numero_versioni_messaggio: {self._numero_versioni_messaggio}"

    def __repr__(self):
        return f"<id_messaggio: {self._id_messaggio}, id_chat: {self._id_chat}, id_utente: {self._id_utente}, testo: {self._testo}, data_creazione: {self._data_creazione}, data_modifica: {self._data_modifica}, numero_versioni_messaggio: {self._numero_versioni_messaggio}>"

