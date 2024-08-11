from sqlalchemy import Column, Integer, ForeignKey
from extensions import db


class PatologiaBambino(db.Model):
    __tablename__ = 'patologiaBambino'

    _idbambino = Column('idbambino', Integer, ForeignKey('bambino.idbambino', ondelete='CASCADE'), primary_key=True)
    _idpatologia = Column('idpatologia', Integer, ForeignKey('patologia.idpatologia', ondelete='CASCADE'),
                          primary_key=True)

    _priority_idbambino = 1
    _priority_idpatologia = 2

    def __init__(self, idbambino: int, idpatologia: int):
        self._idbambino = idbambino
        self._idpatologia = idpatologia

    def __str__(self):
        return f"idbambino: {self.idbambino}, idpatologia: {self.idpatologia}"

    def __repr__(self):
        return f"<PatologiaBambino(idbambino={self.idbambino}, idpatologia={self.idpatologia})>"

    @property
    def idbambino(self) -> int:
        return self._idbambino

    @idbambino.setter
    def idbambino(self, value: int) -> None:
        self._idbambino = value

    @property
    def idpatologia(self) -> int:
        return self._idpatologia

    @idpatologia.setter
    def idpatologia(self, value: int) -> None:
        self._idpatologia = value

    @property
    def to_dict(self) -> dict:
        return {
            'idbambino': self.idbambino,
            'idpatologia': self.idpatologia
        }
