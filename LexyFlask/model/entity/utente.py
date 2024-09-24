import uuid
from typing import Union
from sqlalchemy import Column, String, CHAR
from extensions import db


class Utente(db.Model):
    __tablename__ = 'utente'
    _id_utente = Column('idutente', CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    _username = Column('username', String(80), nullable=False, unique=True)
    _password = Column('password', String(200), nullable=False)
    _email = Column('email', String(200), nullable=False, unique=True)
    _tipologia = Column('tipologia', String(50), nullable=False, default="terapista")

    _priority_id_utente = 1
    _priority_username = 2
    _priority_password = 3
    _priority_email = 4
    _priority_tiologia = 5

    _messaggi = db.relationship("Messaggio", back_populates="_utente")
    _chat = db.relationship("Chat", back_populates="_utente")

    def __init__(self, id_utente: Union[uuid, None], username: str, password: str, email: str, tipologia: str = None):
        self._id_utente = id_utente
        self._username = username
        self._password = password
        self._email = email
        if tipologia:
            self._tipologia = tipologia

    @property
    def username(self) -> str:
        return self._username

    @username.setter
    def username(self, username: str) -> None:
        self._username = username

    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, password: str) -> None:
        self._password = password

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, email: str) -> None:
        self._email = email

    def __str__(self):
        return f"id utente: {self._id_utente} username: {self._username} email: {self._email}"

    def __repr__(self):
        return f"<Utente id utente: {self._id_utente} username: {self._username} email: {self._email}>"

    @property
    def id_utente(self) -> Union[uuid, None]:
        return self._id_utente

    def to_dict(self):
        return {
            "id_utente": self._id_utente,
            "username": self._username,
            "email": self._email,
            "tipologia": self._tipologia
        }
