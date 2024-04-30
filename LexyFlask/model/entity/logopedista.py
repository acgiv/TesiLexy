from typing import Union
from sqlalchemy import Column, Integer, ForeignKey

from extensions import db


class Logopedista(db.Model):
    __tablename__ = 'logopedista'
    _id_logopedista = Column('idlogopedista', Integer, ForeignKey('utente.idutente'), primary_key=True)

    _priority_id_logopedista = 1

    def __init__(self, id_logopedista: int | None):
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
