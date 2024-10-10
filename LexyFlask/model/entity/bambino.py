from typing import Union
from sqlalchemy import Column, String, ForeignKey, CHAR, DATE, BOOLEAN
from sqlalchemy.orm import relationship
from model.entity.patologiaBambino import PatologiaBambino
from model.entity.utente import Utente
import uuid
from extensions import db


class Bambino(Utente):
    __tablename__ = 'bambino'
    _id_bambino = Column('idbambino', CHAR(36), ForeignKey('utente.idutente', ondelete='CASCADE'),
                         primary_key=True)
    _nome = Column('nome', String(50))
    _cognome = Column('cognome', String(50))
    _data_nascita = Column('dataNascita', DATE)
    _descrizione = Column('descrizione', String(300))
    _id_terapista = Column('id_terapista', CHAR(36), ForeignKey('utente.idutente'))
    _patologie = relationship("Patologia", secondary=PatologiaBambino.__tablename__)
    _controllo_terapista = Column("controllo_terapista", BOOLEAN)

    __mapper_args__ = {
        'polymorphic_identity': 'bambino',
        'inherit_condition': _id_bambino == Utente._id_utente  # Condizione di eredità basata su _id_bambino
    }

    _messaggi = db.relationship("Messaggio", back_populates="_utente")
    _chat = db.relationship("Chat", back_populates="_utente")

    def __init__(self, username: str, password: str, nome: str, cognome: str, data_nascita: str,
                 descrizione: str, email: str, id_terapista: str, controllo_terapista: bool,
                 id_bambino: Union[uuid, None] = None, id_utente: Union[uuid, None] = None):
        super().__init__(id_utente, username, password, email, "bambino")
        self._id_bambino = id_bambino
        self._nome = nome
        self._cognome = cognome
        self._data_nascita = data_nascita
        self._descrizione = descrizione
        self._id_terapista = id_terapista
        self._controllo_terapista = controllo_terapista

    @property
    def id_bambino(self) -> Union[uuid, None]:
        return self._id_bambino

    @id_bambino.setter
    def id_bambino(self, _id_bambino: uuid) -> None:
        self._id_bambino = _id_bambino

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

    @property
    def id_terapista(self) -> Union[uuid, None]:
        return self._id_terapista

    @id_terapista.setter
    def id_terapista(self, id_terapista: str) -> None:
        self._id_terapista = id_terapista

    @property
    def controllo_terapista(self) -> Union[bool, None]:
        return self._controllo_terapista

    @controllo_terapista.setter
    def controllo_terapista(self, controllo_terapista: str) -> None:
        self._controllo_terapista = controllo_terapista

    def __str__(self):
        return (f"ID Bambino: {self._id_bambino}, Nome: {self._nome}, Cognome: {self._cognome},"
                f" id_terapista: {self.id_terapista}") + super().__str__()

    def __repr__(self):
        return (f"<Bambino ID: {self._id_bambino}, Nome: {self._nome}, Cognome: {self._cognome},"
                f" id_terapista: {self.id_terapista}") + super().__repr__()

    def to_dict(self):
        base_dict = super().to_dict()
        bambino_dict = {
            "id_bambino": self._id_bambino,
            "nome": self._nome,
            "cognome": self._cognome,
            "data_nascita": str(self._data_nascita),  # Se vuoi convertire la data in stringa
            "descrizione": self._descrizione,
            "id_terapista": self._id_terapista,
            "controllo_terapista": self._controllo_terapista,
            "patologie": [patologia.to_dict() for patologia
                          in self._patologie]
        }
        return {**bambino_dict, **base_dict}
