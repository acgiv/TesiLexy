from typing import List, Type, Any, Union
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from model.dao.base_dao import BaseDao
from model.entity.chat import Chat
from model.entity.logopedista import Logopedista
from flask import current_app


class ChatRepository(BaseDao):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, chat: Union[Chat, List[Chat]]) -> None:
        try:
            if isinstance(chat, Chat):
                self.database.add(chat)
                self.database.commit()
                current_app.web_logger.info("Inserimento della chat è stato completato con successo.")
            elif isinstance(chat, list):
                self.database.add_all(chat)
                self.database.commit()
                current_app.web_logger.info("Inserimento delle chat è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento delle chat: {str(e)}")

    def delete(self, chat: Union[Chat, List[Chat]]) -> None:
        try:
            if isinstance(chat, Chat):
                self.database.delete(chat)
                self.database.commit()
                current_app.web_logger.info("Eliminazione della chat è stato completato con successo.")
            elif isinstance(chat, list):
                for c in chat:
                    self.database.delete(c)
                self.database.commit()
                current_app.web_logger.info("Eliminazione delle chat è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione delle chat: {str(e)}")

    def update(self, chat: Union[Chat, List[Chat]]) -> None:
        try:
            if isinstance(chat, Chat):
                self.database.merge(chat)
                self.database.commit()
                current_app.web_logger.info("Update della chat è stato completato con successo.")
            elif isinstance(chat, list):
                for c in chat:
                    self.database.merge(c)
                self.database.commit()
                current_app.web_logger.info("Update delle chat è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'update delle chat: {str(e)}")

    def find_all(self, limit: int | None = None) -> list[Type[Chat]]:
        try:
            query = Chat.query.order_by(Chat.id_chat)
            if limit is not None:
                query = query.limit(limit)
            return query.all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutte le chat: {str(e)}")
            return []

    def find_all_by_id(self, id_chat: int) -> Union[List, None]:
        try:
            return Chat.query.filter_by(_id_chat=id_chat).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    @staticmethod
    def find_all_User_Chat(user_filter: Any) -> list[Type[Chat]]:
        """
               Trova tutti i messaggi di chat in base a un filtro utente.
               Args:
                   user_filter: Condizione SQLAlchemy per filtrare i messaggi della chat in base all'utente.
                                È possibile combinare condizioni con and_() e or_().
               Returns:
                   Una lista di oggetti Chat che soddisfano il filtro utente.

               Example:
                   Per trovare tutti i messaggi della chat dell'utente con nome utente "Alicea" o "Giovanna"
                   e che sono stati creati dopo una certa data:
                   username_filter = or_(User.username == "Alicea", User.username == "Giovanna")
                   date_filter = User.data_creazione > datetime.datetime(2023, 1, 1)
                   user_filter = and_(username_filter, date_filter)
                   NomeClasse.find_all_User_Chat(user_filter)
               """
        try:
            return db.session.query(Chat, Logopedista).join(Logopedista).filter(user_filter).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutte le chat: {str(e)}")
            return []
