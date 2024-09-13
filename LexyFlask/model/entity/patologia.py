from sqlalchemy import Column, Integer, String
from extensions import db


class Patologia(db.Model):
    __tablename__ = 'patologia'

    _id_patologia = Column("idpatologia", Integer, primary_key=True, autoincrement=True)
    _nome_patologia = Column("nome", String(50))

    _priority_idpatologia = 1
    _priority_nome_patologia = 2

    def __init__(self, nome_patologia: str):
        self._nome_patologia = nome_patologia

    @property
    def id_patologia(self) -> int:
        return self._idpatologia

    @id_patologia.setter
    def id_patologia(self, value: int) -> None:
        self._id_patologia = value

    @property
    def nome_patologia(self) -> str:
        return self._nome_patologia

    @nome_patologia.setter
    def nome_patologia(self, value: str) -> None:
        self._nome_patologia = value

    def __repr__(self):
        return f"<Patologia(idpatologia={self._id_patologia}, nome_patologia='{self._nome_patologia}')>"



