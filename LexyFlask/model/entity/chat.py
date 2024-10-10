from typing import Union
from sqlalchemy import Column, String, ForeignKey, CHAR, PrimaryKeyConstraint
from extensions import db
import uuid


class Chat(db.Model):  # Inherit from Base
    __tablename__ = "chat"
    _id_chat = Column('idchat', CHAR(36), primary_key=True)
    _id_bambino = Column('idbambino', CHAR(36), ForeignKey('bambino.idbambino', ondelete='CASCADE'),
                         nullable=False, primary_key=True)
    _titolo = Column("titolo", String(200), nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('idchat', 'idbambino'),
    )

    # Definisci la relazione con la tabella degli utenti
    _utente = db.relationship("Bambino", back_populates="_chat")
    _messaggi = db.relationship("Messaggio", back_populates="_chat",  cascade="all, delete-orphan")

    def __init__(self, id_chat: None | str, id_bambino: str, titolo: str):
        if self._id_chat is None:
            self._id_chat = uuid.uuid4()
        else:
            self._id_chat = id_chat
        self._id_bambino = id_bambino
        self._titolo = titolo

    @property
    def id_chat(self) -> Union[None, str]:  # Metodo getter per 'id_chat'
        return self._id_chat

    @id_chat.setter
    def id_chat(self, id_chat) -> None:  # Metodo setter per 'id_chat'
        self._id_chat = id_chat

    @property
    def id_bambino(self) -> Union[None, str]:  # Metodo getter per 'id_utente'
        return self._id_bambino

    @id_bambino.setter
    def id_bambino(self, id_bambino: str) -> None:  # Metodo setter per 'id_utente'
        self._id_bambino = id_bambino

    @property
    def titolo(self) -> Union[None, str]:  # Metodo getter per 'titolo'
        return self._titolo

    @titolo.setter
    def titolo(self, titolo: str) -> None:  # Metodo setter per 'titolo'
        self._titolo = titolo

    @id_chat.deleter
    def id_chat(self) -> None:
        del self._id_chat

    @id_bambino.deleter
    def id_bambino(self) -> None:
        del self._id_bambino

    @titolo.deleter
    def titolo(self) -> None:
        del self._titolo

    def __str__(self):
        return f"Chat chat_id: {self._id_chat}, id_bambino: {self._id_bambino}, id_titolo: {self._titolo}"

    def __repr__(self):
        return f"<Chat id_chat: {self._id_chat}, id_bambino: {self._id_bambino}, titolo: {self._titolo}>"

    def to_dict(self) -> dict:
        return {
            'idbambino': self._id_bambino,
            'idchat': self._id_chat,
            'titolo': self._titolo
        }
