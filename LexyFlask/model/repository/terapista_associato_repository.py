from abc import ABC
from typing import Union, List
import uuid
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app
from sqlalchemy.orm import aliased

from model.dao.base_dao import BaseDao
from extensions import db
from model.entity.bambino import Bambino
from model.entity.terapista_associato import TerapistaAssociato
from model.entity.utente import Utente


class TerapistaAssociatoRepository(BaseDao, ABC):
    def __init__(self) -> None:
        self.database = db.session
        self.bambino_terapista = TerapistaAssociato

    def insert(self, bambino_terapista: Union[TerapistaAssociato, List[TerapistaAssociato]]) -> None:
        try:
            if isinstance(bambino_terapista, TerapistaAssociato):
                self.database.add(bambino_terapista)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento del bambino_terapista è stato completato con successo.")
            elif isinstance(bambino_terapista, List):
                self.database.add_all(bambino_terapista)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Inserimento dei logopedisti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'inserimento dei logopedisti: {str(e)}")

    def delete(self, bambino_terapista: Union[TerapistaAssociato, list[TerapistaAssociato]]) -> None:
        try:
            if isinstance(bambino_terapista, TerapistaAssociato):
                self.database.delete(bambino_terapista)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Eliminazione del bambino_terapista è stato completato con successo.")
            elif isinstance(bambino_terapista, list):
                for component in bambino_terapista:
                    self.database.delete(component)
                    self.database.commit()
                    if hasattr(current_app, "web_logger"):
                        current_app.web_logger.info("Eliminazione dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'eliminazione dei logopedisti: {str(e)}")
            return None

    def update(self, bambino_terapista: Union[TerapistaAssociato, List[TerapistaAssociato]]) -> None:
        try:
            if isinstance(bambino_terapista, TerapistaAssociato):
                self.database.merge(bambino_terapista)
                self.database.commit()
                if hasattr(current_app, "web_logger"):
                    current_app.web_logger.info("Aggiornamento del bambino_terapista è stato completato con successo.")
            elif isinstance(bambino_terapista, List):
                for u in bambino_terapista:
                    self.database.merge(u)
                    self.database.commit()
                    if hasattr(current_app, "web_logger"):
                        current_app.web_logger.info("Aggiornamento dei logopedisti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante l'aggiornamento dei logopedisti: {str(e)}")
            return None

    def find_all(self, limit: Union[int, None]) -> List[TerapistaAssociato] | None:
        try:
            return self.bambino_terapista.query.limit(limit).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca di tutti i logopedisti: {str(e)}")
            return None

    def find_all_by_id(self, id_search: uuid, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            if type_search == "terapista":
                return self.bambino_terapista.query.filter_by(_idterapista=id_search).all()
            else:
                return self.bambino_terapista.query.filter_by(_idbambino=id_search).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_by_email_terapista(self, id_search: uuid, ) -> Union[List[str], None]:
        try:
            return self.database.query(Utente._email).join(self.bambino_terapista,
                                                           self.bambino_terapista._idterapista == Utente._id_utente).filter(
                self.bambino_terapista._idbambino == id_search).all()
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_all_terapisti_associati(self, id_search: uuid, id_terapista: uuid) -> Union[
        List[TerapistaAssociato], None]:
        try:
            terapista_alias = aliased(Utente)
            return (self.bambino_terapista.query
                    .join(terapista_alias, self.bambino_terapista._idterapista == terapista_alias._id_utente)
                    .with_entities(self.bambino_terapista, terapista_alias._email)
                    .filter(self.bambino_terapista._idbambino == id_search,
                            self.bambino_terapista._idterapista != id_terapista)
                    .all())
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
        return None

    def find_all_terapista_by_email(self, email_search: str) -> Union[TerapistaAssociato, None]:
        try:
            terapista_alias = aliased(Utente)
            return (self.bambino_terapista.query
                    .join(terapista_alias, self.bambino_terapista._idterapista == terapista_alias._id_utente)
                    .with_entities(self.bambino_terapista)
                    .filter(terapista_alias._email.ilike(f'{email_search}'))
                    .first())
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
        return None

    def find_all_user_child_by_therapist(self, id_search: uuid) -> Union[List, None]:
        try:
            bambino_alias = aliased(Utente)
            return (self.database.query(self.bambino_terapista)
                    .join(bambino_alias, self.bambino_terapista._idbambino == bambino_alias._id_utente)
                    .filter(self.bambino_terapista._idterapista == id_search)
                    .with_entities(bambino_alias._username)
                    .all())
        except SQLAlchemyError as e:
            if hasattr(current_app, "web_logger"):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
