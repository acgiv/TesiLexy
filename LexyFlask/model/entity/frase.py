from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.mysql import LONGTEXT

from extensions import db


class Frase(db.Model):
    __tablename__ = 'frase'

    _id_frase = Column("idpfrase", Integer, primary_key=True, autoincrement=True)
    _testo = Column("testo", LONGTEXT)
    _immagine = Column("immagine", String(50))
    _soggetto = Column("soggetto", String(50))
    _contesto = Column("contesto", LONGTEXT)

    def __init__(self, testo: str, immagine: str, soggetto: str, contesto: str, id_frase: int = None):
        if id_frase is not None:
            self._id_frase = id_frase
        self._contesto = contesto
        self._immagine = immagine
        self._testo = testo
        self._soggetto = soggetto

        # Property for _id_frase

    @property
    def id_frase(self):
        return self._id_frase

    @id_frase.setter
    def id_frase(self, value):
        self._id_frase = value

    @id_frase.deleter
    def id_frase(self):
        del self._id_frase

    # Property for _testo
    @property
    def testo(self):
        return self._testo

    @testo.setter
    def testo(self, value):
        self._testo = value

    @testo.deleter
    def testo(self):
        del self._testo

    # Property for _immagine
    @property
    def immagine(self):
        return self._immagine

    @immagine.setter
    def immagine(self, value):
        self._immagine = value

    @immagine.deleter
    def immagine(self):
        del self._immagine

    # Property for _soggetto
    @property
    def soggetto(self):
        return self._soggetto

    @soggetto.setter
    def soggetto(self, value):
        self._soggetto = value

    @soggetto.deleter
    def soggetto(self):
        del self._soggetto

    # Property for _contesto
    @property
    def contesto(self):
        return self._contesto

    @contesto.setter
    def contesto(self, value):
        self._contesto = value

    @contesto.deleter
    def contesto(self):
        del self._contesto

        # to_dict method

    def to_dict(self):
        return {
            "id_frase": self.id_frase,
            "testo": self.testo,
            "immagine": self.immagine,
            "soggetto": self.soggetto,
            "contesto": self.contesto
        }

        # __repr__ method

    def __repr__(self):
        return (f"<Frasi(id_frase={self.id_frase}, testo='{self.testo}',"
                f" immagine='{self.immagine}', soggetto='{self.soggetto}',"
                f" contesto='{self.contesto}')>")
