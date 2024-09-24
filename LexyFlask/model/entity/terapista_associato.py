from sqlalchemy import Column, ForeignKey, CHAR
from extensions import db


class TerapistaAssociato(db.Model):
    __tablename__ = 'TerapistaAssociato'

    _idbambino = Column('idbambino', CHAR(36), ForeignKey('bambino.idbambino', ondelete='CASCADE'), primary_key=True)
    _idterapista = Column('idterapista', CHAR(36), ForeignKey("utente.idutente", ondelete='CASCADE'),
                          primary_key=True)

    _priority_idbambino = 1
    _priority_idterapista = 2

    def __init__(self, idbambino: str, idterapista: str):
        self._idbambino = idbambino
        self._idterapista = idterapista

    def __str__(self):
        return f"idbambino: {self.idbambino}, idterapista: {self.idterapista}"

    def __repr__(self):
        return f"<TerapistaAssociato(idbambino={self.idbambino}, idterapista={self.idterapista})>"

    @property
    def idbambino(self) -> str:
        return self._idbambino

    @idbambino.setter
    def idbambino(self, value: str) -> None:
        self._idbambino = value

    @property
    def idterapista(self) -> str:
        return self._idterapista

    @idterapista.setter
    def idterapista(self, value: str) -> None:
        self._idterapista = value

    def to_dict(self) -> dict:
        return {
            'idbambino': self.idbambino,
            'idterapista': self.idterapista
        }
