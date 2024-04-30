from typing import Union
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from extensions import db


class Utente(db.Model):
    __tablename__ = 'utente'
    _id_utente = Column('idutente', Integer, primary_key=True, autoincrement=True)
    _username = Column('username', String(80), nullable=False, unique=True)
    _password = Column('password', String(200), nullable=False)
    _email = Column('email', String(200), nullable=False, unique=True)
    _data_nascita = Column('datanascita', DateTime, nullable=False)
    _sesso = Column("sesso", String(20), nullable=False)

    _priority_id_utente = 1
    _priority_username = 2
    _priority_password = 3
    _priority_email = 4
    _priority_data_nascita = 5
    _priority_sesso = 6

    _messaggi = db.relationship("Messaggio", back_populates="_utente")
    _chat = db.relationship("Chat", back_populates="_utente")

    def __init__(self, id_utente: Union[int, None],  username: str, password: str, email: str,
                 data_nascita: datetime, sesso: str):
        self._id_utente = id_utente
        self._username = username
        self._password = password
        self._email = email
        self._data_nascita = data_nascita
        self._sesso = sesso

    @property
    def id_persona(self) -> Union[int, None]:
        return self._id_utente

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

    @property
    def data_nascita(self) -> datetime:
        return self._data_nascita

    @data_nascita.setter
    def data_nascita(self, data_nascita: datetime) -> None:
        self._data_nascita = data_nascita

    @property
    def sesso(self) -> str:
        return self._sesso

    @sesso.setter
    def sesso(self, sesso: str) -> None:
        self._sesso = sesso

    def __str__(self):
        return f"id utente: {self._id_utente} username: {self._username} email: {self._email}" \
               f" data_nascita: {self._data_nascita} sesso: {self._sesso}"

    def __repr__(self):
        return f"<Utente id utente: {self._id_utente} username: {self._username} email: {self._email}" \
               f" data_nascita: {self._data_nascita} sesso: {self._sesso}>"

    @property
    def id_utente(self):
        return self._id_utente
