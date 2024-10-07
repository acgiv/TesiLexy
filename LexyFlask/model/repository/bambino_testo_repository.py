from abc import ABC
from typing import Union, List
import uuid
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from extensions import db
from model.entity.bambino_testo import BambinoTesto


class BambinoTestoRepository(ABC):
    def __init__(self) -> None:
        self.database = db.session
        self.bambino_testo = BambinoTesto

    def insert(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        try:
            if isinstance(bambino_testo, BambinoTesto):
                self.database.add(bambino_testo)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento del bambino_testo completato con successo.")
            elif isinstance(bambino_testo, list):
                self.database.add_all(bambino_testo)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento di più bambino_testo completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'inserimento di bambino_testo: {str(e)}")

    def delete(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        try:
            if isinstance(bambino_testo, BambinoTesto):
                self.database.delete(bambino_testo)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Eliminazione del bambino_testo completata con successo.")
            elif isinstance(bambino_testo, list):
                for bt in bambino_testo:
                    self.database.delete(bt)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Eliminazione di più bambino_testo completata con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'eliminazione di bambino_testo: {str(e)}")

    def update(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        try:
            if isinstance(bambino_testo, BambinoTesto):
                self.database.merge(bambino_testo)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Aggiornamento del bambino_testo completato con successo.")
            elif isinstance(bambino_testo, list):
                for bt in bambino_testo:
                    self.database.merge(bt)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Aggiornamento di più bambino_testo completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'aggiornamento di bambino_testo: {str(e)}")

    def find_all(self, limit: Union[int, None] = None) -> Union[List[BambinoTesto], None]:
        try:
            query = self.bambino_testo.query
            if limit:
                query = query.limit(limit)
            return query.all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca di tutti i record bambino_testo: {str(e)}")
            return None

    def find_by_idbambino(self, idbambino: uuid.UUID) -> Union[List[BambinoTesto], None]:
        try:
            return self.bambino_testo.query.filter_by(_idbambino=idbambino).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per idbambino: {str(e)}")
            return None

    def find_by_idtesto(self, idtesto: uuid.UUID) -> Union[List[BambinoTesto], None]:
        try:
            return self.bambino_testo.query.filter_by(_idtesto=idtesto).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per idtesto: {str(e)}")
            return None

    def find_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: uuid.UUID) -> Union[BambinoTesto, None]:
        try:
            return self.bambino_testo.query.filter_by(_idbambino=idbambino, _idtesto=idtesto).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per idbambino e idtesto: {str(e)}")
            return None

    def delete_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: uuid.UUID) -> None:
        try:
            bambino_testo = self.find_by_bambino_and_testo(idbambino, idtesto)
            if bambino_testo:
                self.delete(bambino_testo)
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'eliminazione per idbambino e idtesto: {str(e)}")
