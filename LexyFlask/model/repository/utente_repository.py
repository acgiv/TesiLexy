import uuid
from abc import ABC
from typing import Union, List
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from flask import current_app
from model.dao.base_dao import BaseDao
from model.entity.utente import Utente


class UtenteRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session
        self.user = Utente

    def insert(self, utente: Union[Utente, List[Utente]]) -> None:
        try:
            if isinstance(utente, Utente):
                self.database.add(utente)
                self.database.commit()
                current_app.web_logger.info("Inserimento dell'utente è stato completato con successo.")
            elif isinstance(utente, List):
                self.database.add_all(utente)
                self.database.commit()
                current_app.web_logger.info("Inserimento degli utenti completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento degli utenti: {str(e)}")

    def delete(self, utente: Union[Utente, List[Utente]]) -> None:
        try:
            if isinstance(utente, Utente):
                self.database.delete(utente)
                self.database.commit()
                current_app.web_logger.info("Eliminazione dell'utente è stata completata con successo.")
            elif isinstance(utente, list):
                for component in utente:
                    self.database.delete(component)
                    self.database.commit()
                    current_app.web_logger.info("Eliminazione degli utenti è stata completata con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione degli utenti: {str(e)}")

    def update(self, utente: Union[Utente, List[Utente]]) -> None:
        try:
            if isinstance(utente, Utente):
                self.database.merge(utente)
                self.database.commit()
                current_app.web_logger.info("Aggiornamento dell'utente è stato completato con successo.")
            elif isinstance(utente, List):
                for u in utente:
                    self.database.merge(u)
                    self.database.commit()
                    current_app.web_logger.info("Aggiornamento degli utenti è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'aggiornamento degli utenti: {str(e)}")

    def find_all(self, limit: Union[int, None]) -> Union[List[Utente], None]:
        try:
            return Utente.query.limit(limit).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutti gli utenti: {str(e)}")
            return list()

    def find_all_by_id(self, id_utente: int, type_search: Union[Utente, None] = None) -> Union[List, None]:
        try:
            return Utente.query.filter_by(_id_utente=id_utente).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_by_username_and_password(self, username: str, password: str) -> Union[Utente, None]:
        try:
            return self.user.query.filter_by(_username=username, _password=password).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per username e password: {str(e)}")
            return None

    def find_by_username(self, username: str) -> Union[Utente, None]:
        try:
            return self.user.query.filter_by(_username=username).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per username: {str(e)}")
            return None

    def find_by_email(self, email: str) -> Union[Utente, None]:
        try:
            return self.user.query.filter_by(_email=email).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per username: {str(e)}")
            return None

    def find_all_email_therapist(self, type_user: str) -> Union[List[str], None]:
        try:
            return  self.user.query.with_entities(self.user._email).filter_by(_tipologia=type_user).all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per username: {str(e)}")
            return None
