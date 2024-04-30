from typing import Union

from sqlalchemy import Column, String, Integer
from extensions import db


class Label(db.Model):
    __tablename__ = "label"
    _id_label = Column('idlabel', Integer, primary_key=True, autoincrement=True)
    _label = Column('label', String(120), unique=False, nullable=False)
    _valore = Column("valore", String(200), unique=False, nullable=False)

    _priority_id_label = 1
    _priority_label = 2
    _priority_valore = 3

    def __init__(self, id_label: int | None, label: str, valore: str):
        self._id_label = id_label
        self._label = label
        self._valore = valore

    def __str__(self):
        return f"id_label: {self._id_label} label: {self._label} valore: {self._valore}"

    def __repr__(self):
        return f"<id_label: {self._id_label} label: {self._label} valore: {self._valore}>\n"

    @property
    def id_label(self) -> Union[None, int]:  # Metodo getter per 'id_label'
        return self._id_label

    @id_label.setter
    def id_label(self, id_label) -> None:  # Metodo setter per 'id_label'
        self._id_label = id_label

    @property
    def label(self) -> Union[None, str]:  # Metodo getter per 'label'
        return self._label

    @label.setter
    def label(self, label: str) -> None:  # Metodo setter per 'label'
        self._label = label

    @property
    def valore(self) -> Union[None, str]:  # Metodo getter per 'valore'
        return self._valore

    @id_label.deleter
    def id_label(self) -> None:
        del self._id_label

    @label.deleter
    def label(self) -> None:
        del self._label

    @valore.deleter
    def valore(self) -> None:
        del self._valore

    @valore.setter
    def valore(self, valore: str) -> None:  # Metodo setter per 'valore'
        self._valore = valore
