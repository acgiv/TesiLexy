from abc import ABC
from typing import List, Type, Union
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from flask import current_app

from model.dao.base_dao import BaseDao
from model.entity.messaggio import Messaggio


class MessaggioRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        try:
            if isinstance(messaggio, Messaggio):
                self.database.add(messaggio)
                self.database.commit()
                current_app.web_logger.info("Inserimento del messaggio è stato completato con successo.")
            elif isinstance(messaggio, list):
                self.database.add_all(messaggio)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei messaggi: {str(e)}")

    def delete(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        try:
            if isinstance(messaggio, Messaggio):
                self.database.delete(messaggio)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del messaggio è stato completato con successo.")
            elif isinstance(messaggio, list):
                for c in messaggio:
                    self.database.delete(c)
                self.database.commit()
                current_app.web_logger.info("Eliminazione dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei messaggi: {str(e)}")

    def update(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        try:
            if isinstance(messaggio, Messaggio):
                self.database.merge(messaggio)
                self.database.commit()
                current_app.web_logger.info("Update del messaggio è stato completato con successo.")
            elif isinstance(messaggio, list):
                for c in messaggio:
                    self.database.merge(c)
                self.database.commit()
                current_app.web_logger.info("Update dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'update dei messaggi: {str(e)}")

    def find_all(self, limit: int | None = None) -> list[Type[Messaggio]]:
        try:
            query = Messaggio.query.order_by(Messaggio.id_messaggio)
            if limit is not None:
                query = query.limit(limit)
            return query.all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutte le messaggio: {str(e)}")
            return list()

    def find_all_by_id(self, id_messaggio: int, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            return Messaggio.query.filter_by(_id_messaggio=id_messaggio).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
