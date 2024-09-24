from typing import List, Type, Any, Union
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from model.dao.base_dao import BaseDao
from model.entity.chat import Chat
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

    def find_all_by_id(self, id_chat: int, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            return Chat.query.filter_by(_id_chat=id_chat).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

