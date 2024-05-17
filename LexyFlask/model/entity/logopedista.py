from typing import Union
from sqlalchemy import Column, Integer, ForeignKey

from extensions import db
from model.entity.utente import Utente


class Logopedista(Utente):
    __tablename__ = 'logopedista'
    _id_logopedista = Column('idlogopedista', Integer, ForeignKey('utente.idutente',  ondelete='CASCADE'), primary_key=True)
    __mapper_args__ = {
        'polymorphic_identity': 'logopedista',
    }
    _priority_id_logopedista = 1

    def __init__(self, username: str, password: str,
                 email: str, id_logopedista: Union[int, None] = None, id_utente: Union[int, None] = None):
        super().__init__(id_utente, username, password, email)
        self._id_logopedista = id_logopedista

    @property
    def id_logopedista(self) -> Union[int, None]:
        return self._id_logopedista

    @id_logopedista.setter
    def id_logopedista(self, id_logopedista: int) -> None:
        self._id_logopedista = id_logopedista

    def __str__(self):
        return f"id logopedista: {self._id_logopedista}, " + super().__str__()

    def __repr__(self):
        return f"<Logopedista id logopedista: {self._id_logopedista}, " + super().__repr__()
