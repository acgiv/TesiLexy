from sqlalchemy import Column, Integer, String, ForeignKey, Table
from extensions import db


class Patologia(db.Model):
    __tablename__ = 'patologia'

    _idpatologia = Column("idpatologia", Integer, primary_key=True, autoincrement=True)
    _nome_patologia = Column("nome", String(50))

    _priority_idpatologia = 1
    _priority_nome_patologia = 2

    def __init__(self, nome_patologia: str):
        self._nome_patologia = nome_patologia

    @property
    def idpatologia(self) -> int:
        return self._idpatologia

    @idpatologia.setter
    def idpatologia(self, value: int) -> None:
        self._idpatologia = value

    @property
    def nome_patologia(self) -> str:
        return self._nome_patologia

    @nome_patologia.setter
    def nome_patologia(self, value: str) -> None:
        self._nome_patologia = value

    def __repr__(self):
        return f"<Patologia(idpatologia={self._idpatologia}, nome_patologia='{self._nome_patologia}')>"



