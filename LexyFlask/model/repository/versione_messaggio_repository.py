from abc import ABC
from typing import List, Type, Union

from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from flask import current_app

from model.dao.base_dao import BaseDao
from model.entity.versione_messaggio import VersioneMessaggio


class VersioneMessaggioRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        try:
            if isinstance(versione_messaggio,  VersioneMessaggio):
                self.database.add(versione_messaggio)
                self.database.commit()
                current_app.web_logger.info("Inserimento della versione del messaggio è stato completato con successo.")
            elif isinstance(versione_messaggio, list):
                self.database.add_all(versione_messaggio)
                self.database.commit()
                current_app.web_logger.info("Inserimento delle versione dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'inserimento delle versione dei messaggi: {str(e)}")

    def delete(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        try:
            if isinstance(versione_messaggio,  VersioneMessaggio):
                self.database.delete(versione_messaggio)
                self.database.commit()
                current_app.web_logger.info("Eliminazione della versione del messaggio è stato completato con"
                                            " successo.")
            elif isinstance(versione_messaggio, list):
                for c in versione_messaggio:
                    self.database.delete(c)
                self.database.commit()
                current_app.web_logger.info("Eliminazione delle versione dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'eliminazione delle versione dei messaggi: {str(e)}")

    def update(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        try:
            if isinstance(versione_messaggio,  VersioneMessaggio):
                self.database.merge(versione_messaggio)
                self.database.commit()
                current_app.web_logger.info("Update della versione del messaggio è stato completato con successo.")
            elif isinstance(versione_messaggio, list):
                for c in versione_messaggio:
                    self.database.merge(c)
                self.database.commit()
                current_app.web_logger.info("Update delle versione dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            current_app.web_logger.error(f"Errore durante l'update delle versione dei messaggi: {str(e)}")

    def find_all(self, limit: int | None = None) -> list[Type[VersioneMessaggio]]:
        try:
            query = VersioneMessaggio.query.order_by(VersioneMessaggio.id_versione_messaggio)
            if limit is not None:
                query = query.limit(limit)
            return query.all()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca di tutte le versione_messaggio: {str(e)}")
            return list()

    def find_all_by_id(self, id_versione_messaggio: int, type_search: Union[str, None] = None) -> Union[List, None]:
        try:
            return VersioneMessaggio.query.filter_by(_id_versione_messaggio=id_versione_messaggio).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
