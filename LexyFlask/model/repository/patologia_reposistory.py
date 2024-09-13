from abc import ABC
from typing import Union, List

from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.patologia import Patologia


class PatologiaReposistory(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session

    def insert(self, patologia: Union[Patologia, List[Patologia]]) -> None:
        try:
            if isinstance(patologia, Patologia):
                self.database.add(patologia)
                self.database.commit()
                current_app.web_logger.info("Inserimento del patologia è stato completato con successo.")
            elif isinstance(patologia, List):
                self.database.add_all(patologia)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, patologia: Union[Patologia, list[Patologia]]) -> None:
        try:
            if isinstance(patologia, Patologia):
                self.database.delete(patologia)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del patologia è stato completato con successo.")
            elif isinstance(patologia, list):
                for component in patologia:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, patologia: Union[Patologia, List[Patologia]]) -> None:
        try:
            if isinstance(patologia, Patologia):
                self.database.merge(patologia)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del patologia è stato completato con successo.")
            elif isinstance(patologia, List):
                for u in patologia:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[Patologia] | None:
        try:
            return Patologia.query.limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_patologia: int) -> Union[List, None]:
        try:
            return Patologia.query.filter_by(_id_patologia=id_patologia).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_in_list(self, list_patologia: list[str]) -> list[Patologia] | None:
        try:
            return Patologia.query.filter(Patologia._nome_patologia.in_(list_patologia)).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
