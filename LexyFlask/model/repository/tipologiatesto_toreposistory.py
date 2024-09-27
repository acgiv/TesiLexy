from abc import ABC
from typing import Union, List
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.tipologiaTesto import TipologiaTesto


class TipologiaTestoReposistory(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session
        self.tipologia = TipologiaTesto

    def insert(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        try:
            if isinstance(tipologia, TipologiaTesto):
                self.database.add(tipologia)
                self.database.commit()
                current_app.web_logger.info("Inserimento del tipologia è stato completato con successo.")
            elif isinstance(tipologia, List):
                self.database.add_all(tipologia)
                self.database.commit()
                current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, tipologia: Union[TipologiaTesto, list[TipologiaTesto]]) -> None:
        try:
            if isinstance(tipologia, TipologiaTesto):
                self.database.delete(tipologia)
                self.database.commit()
                current_app.web_logger.info("Eliminazione del tipologia è stato completato con successo.")
            elif isinstance(tipologia, list):
                for component in tipologia:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")

    def update(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        try:
            if isinstance(tipologia, TipologiaTesto):
                self.database.merge(tipologia)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento del tipologia è stato completato con successo.")
            elif isinstance(tipologia, List):
                for u in tipologia:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[TipologiaTesto] | None:
        try:
            return self.tipologia.query.limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return list()

    def find_all_by_id(self, id_tipologia: int, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            return self.tipologia.query.filter_by(_id_tipologia=id_tipologia).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_in_list(self, list_tipologia: list[str]) -> list[TipologiaTesto] | None:
        try:
            return TipologiaTesto.query.filter(self.tipologia._nome.in_(list_tipologia)).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_id_by_name(self, nome: str) -> Union[List, None]:
        try:
            return db.session.query(self.tipologia._id_tipologia).filter_by(_nome=nome).scalar()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

