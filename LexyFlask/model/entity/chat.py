from typing import Union
from sqlalchemy import Column, Integer, String, ForeignKey
from extensions import db


class Chat(db.Model):  # Inherit from Base
    __tablename__ = "chat"
    _id_chat = Column('idchat', Integer, primary_key=True, autoincrement=True)
    _id_utente = Column('idutente', Integer, ForeignKey('utente.idutente', ondelete='CASCADE'), nullable=False)
    _titolo = Column("titolo", String(200), nullable=False)

    # Definisci la relazione con la tabella degli utenti
    _utente = db.relationship("Utente", back_populates="_chat")
    _messaggi = db.relationship("Messaggio", back_populates="_chat", cascade="all, delete-orphan")

    def __init__(self, id_chat: None | int, id_user: int, titolo: str):
        self._id_chat = id_chat
        self._id_utente = id_user
        self._titolo = titolo

    @property
    def id_chat(self) -> Union[None, int]:  # Metodo getter per 'id_chat'
        return self._id_chat

    @id_chat.setter
    def id_chat(self, id_chat) -> None:  # Metodo setter per 'id_chat'
        self._id_chat = id_chat

    @property
    def id_utente(self) -> Union[None, int]:  # Metodo getter per 'id_utente'
        return self._id_utente

    @id_utente.setter
    def id_utente(self, id_utente: int) -> None:  # Metodo setter per 'id_utente'
        self._id_utente = id_utente

    @property
    def titolo(self) -> Union[None, str]:  # Metodo getter per 'titolo'
        return self._titolo

    @titolo.setter
    def titolo(self, titolo: str) -> None:  # Metodo setter per 'titolo'
        self._titolo = titolo

    @id_chat.deleter
    def id_chat(self) -> None:
        del self._id_chat

    @id_utente.deleter
    def id_utente(self) -> None:
        del self._id_utente

    @titolo.deleter
    def titolo(self) -> None:
        del self._titolo

    def __str__(self):
        return f"Chat chat_id: {self._id_chat}, id_utente: {self._id_utente}, id_titolo: {self._titolo}"

    def __repr__(self):
        return f"<Chat id_chat: {self._id_chat}, id_utente: {self._id_utente}, titolo: {self._titolo}>"
