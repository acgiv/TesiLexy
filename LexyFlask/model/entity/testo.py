from typing import Union

from extensions import db

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT


class TestoOriginale(db.Model):
    __tablename__ = "Testo"
    _id_testo = Column('idtesto', Integer, primary_key=True, autoincrement=True)
    _titolo = Column('titolo', LONGTEXT)
    _testo = Column('testo', LONGTEXT, nullable=False)
    _eta_riferimento = Column('eta_riferimento', Integer, nullable=False)
    _tipologia = Column('tipologia', String(50), nullable=False, default="testo_originale")
    _id_tipologia_testo = Column("tiologia_testo", Integer, ForeignKey("tipologia.idtipologia"), nullable=False)
    _id_terapista = Column("idterapista", String(36), ForeignKey("utente.idutente"))

    __mapper_args__ = {
        'polymorphic_on': _tipologia,
        'polymorphic_identity': 'testo_originale'
    }

    def __init__(self, id_testo: Union[int, None], titolo: str, testo: str, id_tipologia_testo: int,
                 eta_riferimento: Union[int, None] = 0,
                 tipologia: Union[str, None] = None, id_terapista: Union[str, None] = None):
        self._id_testo = id_testo
        self._titolo = titolo
        self._testo = testo
        self._id_tipologia_testo = id_tipologia_testo
        if eta_riferimento:
            self._eta_riferimento = eta_riferimento
        if tipologia:
            self._tipologia = tipologia
        if id_terapista:
            self._id_terapista = id_terapista

    @property
    def id_testo(self) -> int:
        return self._id_testo

    @property
    def titolo(self) -> str:
        return self._titolo

    @titolo.setter
    def titolo(self, titolo: str) -> None:
        self._titolo = titolo

    @property
    def testo(self) -> str:
        return self._testo

    @testo.setter
    def testo(self, testo: str) -> None:
        self._testo = testo

    @property
    def eta_riferimento(self) -> int:
        return self._eta_riferimento

    @eta_riferimento.setter
    def eta_riferimento(self, eta_riferimento: int) -> None:
        self._eta_riferimento = eta_riferimento

    @property
    def tipologia(self) -> str:
        return self._tipologia

    @tipologia.setter
    def tipologia(self, tipologia: str) -> None:
        self._tipologia = tipologia

    @property
    def id_terapista(self) -> str:
        return self._id_terapista

    @id_terapista.setter
    def id_terapista(self, id_terapista: str) -> None:
        self._id_terapista = id_terapista

    @property
    def id_tipologia_testo(self) -> int:  # Usa lo stesso nome per la coerenza
        return self._id_tipologia_testo

    @id_tipologia_testo.setter
    def id_tipologia_testo(self, id_tipologia_testo: int) -> None:  # Usa lo stesso nome per la coerenza
        self._id_tipologia_testo = id_tipologia_testo

    def __str__(self):
        return (f"id testo: {self._id_testo}, titolo: {self._titolo}, testo: {self._testo},"
                f" età riferimento: {self._eta_riferimento}, id_terapista: {self._id_terapista}")

    def __repr__(self):
        return (f"<TestoOriginale id_testo: {self._id_testo}, titolo: {self._titolo}"
                f", età riferimento: {self._eta_riferimento}, id_terapista: {self._id_terapista}>")

    def to_dict(self):
        return {
            "id_testo": self._id_testo,
            "titolo": self._titolo,
            "testo": self._testo,
            "eta_riferimento": self._eta_riferimento,
            "tipologia": self._tipologia,
            "id_tipologia_testo": self._id_tipologia_testo,
            "id_terapista": self._id_terapista
        }


class TestoSpiegato(TestoOriginale):
    __mapper_args__ = {
        'polymorphic_identity': 'testo_spiegato',
    }
