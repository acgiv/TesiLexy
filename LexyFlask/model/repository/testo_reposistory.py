from abc import ABC
from typing import Union, List
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from flask import current_app
from model.dao.base_dao import BaseDao
from model.entity.testo import TestoOriginale


class TestoOriginaleRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session
        self.testo = TestoOriginale

    def insert(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        try:
            if isinstance(testo, TestoOriginale):
                self.database.add(testo)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Inserimento del testo completato con successo.")
                return None
            elif isinstance(testo, List):
                self.database.add_all(testo)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Inserimento dei testi completato con successo.")
                return None
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'inserimento dei testi: {str(e)}")
            return None

    def delete(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        try:
            if isinstance(testo, TestoOriginale):
                self.database.delete(testo)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Eliminazione del testo completata con successo.")
                return None
            elif isinstance(testo, list):
                for component in testo:
                    self.database.delete(component)
                    self.database.commit()
                    if hasattr(current_app, 'web_logger'):
                        current_app.web_logger.info("Eliminazione dei testi completata con successo.")
                    return None
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'eliminazione dei testi: {str(e)}")
            return None

    def update(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        try:
            if isinstance(testo, TestoOriginale):
                self.database.merge(testo)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Aggiornamento del testo completato con successo.")
            elif isinstance(testo, List):
                for t in testo:
                    self.database.merge(t)
                    self.database.commit()
                    if hasattr(current_app, 'web_logger'):
                        current_app.web_logger.info("Aggiornamento dei testi completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'aggiornamento dei testi: {str(e)}")
            return None

    def find_all(self, limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        try:
            return TestoOriginale.query.limit(limit).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca di tutti i testi: {str(e)}")
            return list()

    def find_by_id(self, id_testo: int) -> Union[TestoOriginale, None]:
        try:
            return self.testo.query.filter_by(_id_testo=id_testo).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_by_titolo(self, titolo: str) -> Union[TestoOriginale, None]:
        try:
            return self.testo.query.filter_by(_titolo=titolo).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per titolo: {str(e)}")
            return None

    def find_by_tipologia(self, tipologia: str, limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        try:
            return self.testo.query.filter_by(_tipologia=tipologia).limit(limit).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per tipologia: {str(e)}")
            return None

