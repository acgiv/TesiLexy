from abc import ABC
from typing import Union, List

from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.patologiaBambino import PatologiaBambino


class PatologiaBambinoReposistory(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session

    def insert(self, patologia_bambino: Union[PatologiaBambino, List[PatologiaBambino]]) -> None:
        try:
            if isinstance(patologia_bambino, PatologiaBambino):
                self.database.add(patologia_bambino)
                self.database.commit()
                current_app.web_logger.info("Inserimento del patologia_bambino è stato completato con successo.")
            elif isinstance(patologia_bambino, List):
                self.database.add_all(patologia_bambino)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, patologia_bambino: Union[PatologiaBambino, list[PatologiaBambino]]) -> None:
        try:
            if isinstance(patologia_bambino, PatologiaBambino):
                self.database.delete(patologia_bambino)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del patologia_bambino è stato completato con successo.")
            elif isinstance(patologia_bambino, list):
                for component in patologia_bambino:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, patologia_bambino: Union[PatologiaBambino, List[PatologiaBambino]]) -> None:
        try:
            if isinstance(patologia_bambino, PatologiaBambino):
                self.database.merge(patologia_bambino)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del patologia_bambino è stato completato con successo.")
            elif isinstance(patologia_bambino, List):
                for u in patologia_bambino:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[PatologiaBambino] | None:
        try:
            return PatologiaBambino.query.order_by(PatologiaBambino.id_persona).limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_patologia: int, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            return PatologiaBambino.query.filter_by(_id_patologia_bambino=id_patologia).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
