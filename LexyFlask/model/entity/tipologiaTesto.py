from sqlalchemy import Column, Integer, String
from extensions import db


class TipologiaTesto(db.Model):
    __tablename__ = 'tipologia'

    _id_tipologia = Column("idtipologia", Integer, primary_key=True, autoincrement=True)
    _nome = Column("nome", String(50))

    _priority_idtipologia = 1
    _priority_nome = 2

    def __init__(self, nome: str):
        self._nome = nome

    @property
    def id_tipologia(self) -> int:
        return self._idtipologia

    @id_tipologia.setter
    def id_tipologia(self, value: int) -> None:
        self._id_tipologia = value

    @property
    def nome(self) -> str:
        return self._nome

    @nome.setter
    def nome(self, value: str) -> None:
        self._nome = value

    def to_dict(self):
        return {
            "id_tipologia": self._id_tipologia,
            "nome": self._nome
        }

    def __repr__(self):
        return f"<TipologiaTesto(idtipologia={self._id_tipologia}, nome='{self._nome}')>"

