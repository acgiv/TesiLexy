from abc import ABC
from typing import Union, List

from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.frase import Frase


class FraseRepository(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session
        self.frase = Frase

    def insert(self, frase: Union[Frase, List[Frase]]) -> Union[Frase, List[Frase], None]:
        try:
            if isinstance(frase, Frase):
                self.database.add(frase)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento della frase completato con successo.")
                return frase
            elif isinstance(frase, List):
                self.database.add_all(frase)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento delle frase completato con successo.")
                return frase
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'inserimento delle frase: {str(e)}")

    def delete(self, frase: Union[Frase, list[Frase]]) -> None:
        try:
            if isinstance(frase, Frase):
                self.database.delete(frase)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Eliminazione della frase completata con successo.")
            elif isinstance(frase, list):
                for component in frase:
                    self.database.delete(component)
                    self.database.commit()
                    if hasattr(current_app, "web_logger"):
                        current_app.web_logger.info("Eliminazione delle frase completata con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'eliminazione delle frase: {str(e)}")

    def update(self, frase: Union[Frase, List[Frase]]) -> None:
        try:
            if isinstance(frase, Frase):
                self.database.merge(frase)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Aggiornamento della frase completato con successo.")
            elif isinstance(frase, List):
                for u in frase:
                    self.database.merge(u)
                    self.database.commit()
                    if hasattr(current_app, "web_logger"):
                        current_app.web_logger.info("Aggiornamento delle frase completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'aggiornamento delle frase: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> List[Frase] | None:
        try:
            return Frase.query.order_by(self.frase._id_frase).limit(limit).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca di tutte le frase: {str(e)}")
            return list()

    def find_all_by_id(self, id_frase: int) -> Union[Frase, None]:
        try:
            return self.frase.query.filter_by(_id_frase=id_frase).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_by_testo(self, testo: str) -> Frase | None:
        try:
            return self.frase.query.filter_by(_testo=testo).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per testo: {str(e)}")
            return None
