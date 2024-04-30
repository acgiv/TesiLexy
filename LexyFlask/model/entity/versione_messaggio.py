from datetime import datetime
from typing import Union

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from extensions import db


class VersioneMessaggio(db.Model):
    __tablename__ = "versione_messaggio"
    _id_versione_messaggio = Column('idversionemessaggio', Integer, primary_key=True, autoincrement=True)
    _id_messaggio = Column('idmessaggio', Integer, ForeignKey('messaggio.idmessaggio', ondelete='CASCADE'),
                           nullable=False)
    _testo_versione_messaggio = Column('testomessaggioversione', String(255), nullable=False)
    _testo = Column('testo', String(255), nullable=False)
    _data_creazione = Column('datacreazione', DateTime, nullable=False)
    _modifica_messaggio = Column('modifica_messaggio', DateTime)

    _priority_id_versione_messaggio = 1
    _priority_id_messaggio = 2
    _priority_testo_versione_messaggio = 3
    _priority_testo = 4
    _priority_data_creazione = 5
    _priority_modifica_messaggio = 6

    _messaggi = db.relationship("Messaggio", back_populates="_versioni_messaggi")

    def __init__(self, id_messaggio: int, testo_versione_messaggio: str, testo: str,
                 data_creazione: datetime, modifica_messaggio: datetime):
        self._id_messaggio = id_messaggio
        self._testo_versione_messaggio = testo_versione_messaggio
        self._testo = testo
        self._data_creazione = data_creazione
        self._modifica_messaggio = modifica_messaggio

    @property
    def id_versione_messaggio(self) -> Union[int, None]:
        return self._id_versione_messaggio

    @id_versione_messaggio.setter
    def id_versione_messaggio(self, id_versione_messaggio: int) -> None:
        self._id_versione_messaggio = id_versione_messaggio

    @property
    def id_messaggio(self) -> int:
        return self._id_messaggio

    @id_messaggio.setter
    def id_messaggio(self, id_messaggio: int) -> None:
        self._id_messaggio = id_messaggio

    @property
    def testo_versione_messaggio(self) -> str:
        return self._testo_versione_messaggio

    @testo_versione_messaggio.setter
    def testo_versione_messaggio(self, testo_versione_messaggio: str) -> None:
        self._testo_versione_messaggio = testo_versione_messaggio

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
    def modifica_messaggio(self) -> datetime:
        return self._modifica_messaggio

    @modifica_messaggio.setter
    def modifica_messaggio(self, modifica_messaggio: datetime) -> None:
        self._modifica_messaggio = modifica_messaggio

    @id_versione_messaggio.deleter
    def id_versione_messaggio(self) -> None:
        del self._id_versione_messaggio

    @id_messaggio.deleter
    def id_messaggio(self) -> None:
        del self._id_messaggio

    @testo_versione_messaggio.deleter
    def testo_versione_messaggio(self) -> None:
        del self._testo_versione_messaggio

    @testo.deleter
    def testo(self) -> None:
        del self._testo

    @data_creazione.deleter
    def data_creazione(self) -> None:
        del self._data_creazione

    @modifica_messaggio.deleter
    def modifica_messaggio(self) -> None:
        del self._modifica_messaggio

    def __str__(self):
        return f"id_versione_messaggio: {self._id_versione_messaggio}, id_messaggio: {self._id_messaggio}, " \
               f"testo_versione_messaggio: {self._testo_versione_messaggio}, testo: {self._testo}, " \
               f"data_creazione: {self._data_creazione}, modifica_messaggio: {self._modifica_messaggio}"

    def __repr__(self):
        return f"<id_versione_messaggio: {self._id_versione_messaggio}, id_messaggio: {self._id_messaggio}, " \
               f"testo_versione_messaggio: {self._testo_versione_messaggio}, testo: {self._testo}, " \
               f"data_creazione: {self._data_creazione}, modifica_messaggio: {self._modifica_messaggio}>\n"
