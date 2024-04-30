from abc import ABC
from typing import List, Union

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from model.dao.base_dao import BaseDao
from model.entity.logopedista import Logopedista


class LogopedistaRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, logopedista: Union[Logopedista, List[Logopedista]]) -> None:
        try:
            if isinstance(logopedista, Logopedista):
                self.database.add(logopedista)
                self.database.commit()
                current_app.web_logger.info("Inserimento del logopedista è stato completato con successo.")
            elif isinstance(logopedista, List):
                self.database.add_all(logopedista)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, logopedista: Union[Logopedista, list[Logopedista]]) -> None:
        try:
            if isinstance(logopedista, Logopedista):
                self.database.delete(logopedista)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del logopedista è stato completato con successo.")
            elif isinstance(logopedista, list):
                for component in logopedista:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, logopedista: Union[Logopedista, List[Logopedista]]) -> None:
        try:
            if isinstance(logopedista, Logopedista):
                self.database.merge(logopedista)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del logopedista è stato completato con successo.")
            elif isinstance(logopedista, List):
                for u in logopedista:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[Logopedista] | None:
        try:
            return Logopedista.query.order_by(Logopedista.id_persona).limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_logopedista: int) -> Union[List, None]:
        try:
            return Logopedista.query.filter_by(_id_logopedista=id_logopedista).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
