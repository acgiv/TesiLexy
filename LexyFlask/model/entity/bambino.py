from typing import Union
from sqlalchemy import Column, String, ForeignKey, CHAR, DATE
from sqlalchemy.orm import relationship
from model.entity.patologiaBambino import PatologiaBambino
from model.entity.utente import Utente
import uuid


class Bambino(Utente):
    __tablename__ = 'bambino'
    _id_bambino = Column('idbambino', CHAR(36), ForeignKey('utente.idutente', ondelete='CASCADE'),
                         primary_key=True)
    _nome = Column('nome', String(50))
    _cognome = Column('cognome', String(50))
    _data_nascita = Column('dataNascita', DATE)
    _descrizione = Column('descrizione', String(300))
    patologie = relationship("Patologia", secondary=PatologiaBambino.__tablename__)

    __mapper_args__ = {
        'polymorphic_identity': 'bambino',
        'inherit_condition': _id_bambino == Utente._id_utente
    }

    def __init__(self, username: str, password: str, nome: str, cognome: str, data_nascita: str,
                 descrizione: str, email: str,
                 id_bambino: Union[uuid, None] = None, id_utente: Union[uuid, None] = None):
        super().__init__(id_utente, username, password, email)
        self._id_bambino = id_bambino
        self._nome = nome
        self._cognome = cognome
        self._data_nascita = data_nascita
        self._descrizione = descrizione

    @property
    def id_bambino(self) -> Union[uuid, None]:
        return self._id_bambino

    @id_bambino.setter
    def id_bambino(self, id_bambino: uuid) -> None:
        self._id_bambino = id_bambino

    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, nome: str) -> None:
        self._nome = nome

    @property
    def cognome(self) -> str:
        return self._cognome

    @cognome.setter
    def cognome(self, cognome: str) -> None:
        self._cognome = cognome

    @property
    def data_nascita(self) -> str:
        return self._data_nascita

    @data_nascita.setter
    def data_nascita(self, data_nascita: str) -> None:
        self._data_nascita = data_nascita

    @property
    def descrizione(self) -> str:
        return self._descrizione

    @descrizione.setter
    def descrizione(self, descrizione: str) -> None:
        self._descrizione = descrizione

    def __str__(self):
        return f"ID Bambino: {self._id_bambino}, Nome: {self._nome}, Cognome: {self._cognome}, " + super().__str__()

    def __repr__(self):
        return f"<Bambino ID: {self._id_bambino}, Nome: {self._nome}, Cognome: {self._cognome}, " + super().__repr__()
