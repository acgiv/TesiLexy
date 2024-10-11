from abc import ABC
from typing import Union, List

from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.bambino import Bambino


class BambinoReposistory(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session

    def insert(self, bambino: Union[Bambino, List[Bambino]]) -> None:
        try:
            if isinstance(bambino, Bambino):
                self.database.add(bambino)
                self.database.commit()
                current_app.web_logger.info("Inserimento del bambino è stato completato con successo.")
            elif isinstance(bambino, List):
                self.database.add_all(bambino)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, bambino: Union[Bambino, list[Bambino]]) -> None:
        try:
            if isinstance(bambino, Bambino):
                self.database.delete(bambino)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del bambino è stato completato con successo.")
            elif isinstance(bambino, list):
                for component in bambino:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, bambino: Union[Bambino, List[Bambino]]) -> None:
        try:
            if isinstance(bambino, Bambino):
                self.database.merge(bambino)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del bambino è stato completato con successo.")
            elif isinstance(bambino, List):
                for u in bambino:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[Bambino] | None:
        try:
            return Bambino.query.order_by(Bambino.id_persona).limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_bambino: int) -> Union[Bambino, None]:
        try:
            return Bambino.query.filter_by(_id_bambino=id_bambino).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    @staticmethod
    def find_by_username_and_password(username: str, password: str) -> Bambino | None:
        try:
            return Bambino.query.filter_by(username=username, password=password).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per username e password: {str(e)}")
            return None
