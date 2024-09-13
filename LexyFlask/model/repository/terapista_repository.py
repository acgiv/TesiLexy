from abc import ABC
from typing import List, Union

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from model.dao.base_dao import BaseDao
from model.entity.terapista import Terapista


class TerapistaRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, terapista: Union[Terapista, List[Terapista]]) -> None:
        try:
            if isinstance(terapista, Terapista):
                self.database.add(terapista)
                self.database.commit()
                current_app.web_logger.info("Inserimento del terapista è stato completato con successo.")
            elif isinstance(terapista, List):
                self.database.add_all(terapista)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, terapista: Union[Terapista, list[Terapista]]) -> None:
        try:
            if isinstance(terapista, Terapista):
                self.database.delete(terapista)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del terapista è stato completato con successo.")
            elif isinstance(terapista, list):
                for component in terapista:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, terapista: Union[Terapista, List[Terapista]]) -> None:
        try:
            if isinstance(terapista, Terapista):
                self.database.merge(terapista)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del terapista è stato completato con successo.")
            elif isinstance(terapista, List):
                for u in terapista:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[Terapista] | None:
        try:
            return Terapista.query.order_by(Terapista.id_persona).limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_terapista: int) -> Union[List, None]:
        try:
            return Terapista.query.filter_by(_id_terapista=id_terapista).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
