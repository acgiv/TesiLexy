from sqlalchemy import Column, ForeignKey, CHAR, PrimaryKeyConstraint, Integer
from extensions import db


class BambinoTesto(db.Model):
    __tablename__ = 'BambinoTesto'

    _idbambino = Column('idbambino', CHAR(36), ForeignKey('bambino.idbambino', ondelete='CASCADE'), primary_key=True)
    _idtesto = Column('idtesto', Integer, ForeignKey("testo.idtesto", ondelete='CASCADE'), primary_key=True)

    __table_args__ = (
        PrimaryKeyConstraint('idbambino', 'idtesto'),
    )

    bambino = db.relationship('Bambino', backref="testi_associati", foreign_keys=[_idbambino])
    testo = db.relationship('TestoOriginale', backref="testi_associati", foreign_keys=[_idtesto])

    def __init__(self, idbambino: str, idtesto: str):
        self._idbambino = idbambino
        self._idtesto = idtesto

    def __str__(self):
        return f"idbambino: {self.idbambino}, idtesto: {self._idtesto}"

    def __repr__(self):
        return f"<BambinoTesto(idbambino={self.idbambino}, idtesto={self._idtesto})>"

    @property
    def idbambino(self) -> str:
        return self._idbambino

    @idbambino.setter
    def idbambino(self, value: str) -> None:
        self._idbambino = value

    @property
    def idtesto(self) -> str:
        return self._idtesto

    @idtesto.setter
    def idtesto(self, value: str) -> None:
        self._idtesto = value

    def to_dict(self) -> dict:
        return {
            'idbambino': self.idbambino,
            'idtesto': self.idtesto
        }
