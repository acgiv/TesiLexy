from typing import Union
from sqlalchemy import Column, ForeignKey, CHAR
from model.entity.utente import Utente


class Terapista(Utente):
    __tablename__ = 'terapista'
    _id_terapista = Column('idterapista', CHAR(36), ForeignKey('utente.idutente',  ondelete='CASCADE'),
                             primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'terapista',
        'inherit_condition': _id_terapista == Utente._id_utente
    }
    _priority_id_terapista = 1

    def __init__(self, username: str, password: str,
                 email: str, _id_terapista: Union[int, None] = None, id_utente: Union[int, None] = None):
        super().__init__(id_utente, username, password, email)
        self._id_terapista = _id_terapista

    @property
    def id_terapista(self) -> Union[int, None]:
        return self._id_terapista

    @id_terapista.setter
    def id_terapista(self, id_terapista: int) -> None:
        self._id_terapista = id_terapista

    def __str__(self):
        return f"id terapista: {self._id_terapista}, " + super().__str__()

    def __repr__(self):
        return f"<Logopedista id terapista: {self._id_terapista}, " + super().__repr__()
