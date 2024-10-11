from abc import ABC
from typing import List, Type, Union, Tuple

from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from flask import current_app

from model.dao.base_dao import BaseDao
from model.entity.messaggio import Messaggio


class MessaggioRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session
        self.messaggio = Messaggio

    def insert(self, messaggio: Union[Messaggio, List[Messaggio]]) -> Messaggio:
        try:
            if isinstance(messaggio, Messaggio):
                self.database.add(messaggio)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Inserimento del messaggio è stato completato con successo.")
                return messaggio
            elif isinstance(messaggio, list):
                count = self.database.query(Messaggio).count()
                for m in messaggio:
                    count = count + 1
                    m.index_message = count
                self.database.add_all(messaggio)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Inserimento dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'inserimento dei messaggi: {str(e)}")

    def delete(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        try:
            if isinstance(messaggio, Messaggio):
                count = self.database.query(Messaggio).count()
                messaggio.index_message = count - 1
                self.database.delete(messaggio)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Eliminazione del messaggio è stato completato con successo.")
            elif isinstance(messaggio, list):
                count = self.database.query(Messaggio).count()
                for c in messaggio:
                    count = count - 1
                    c.index_message = count
                    self.database.delete(c)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Eliminazione dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'eliminazione dei messaggi: {str(e)}")

    def update(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        try:
            if isinstance(messaggio, Messaggio):
                self.database.merge(messaggio)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Update del messaggio è stato completato con successo.")
            elif isinstance(messaggio, list):
                for c in messaggio:
                    self.database.merge(c)
                self.database.commit()
                if hasattr(current_app, 'web_logger'):
                    current_app.web_logger.info("Update dei messaggi è stato completato con successo.")
        except SQLAlchemyError as e:
            self.database.rollback()
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante l'update dei messaggi: {str(e)}")

    def find_all(self, limit: int | None = None) -> list[Type[Messaggio]]:
        try:
            query = self.messaggio.query.order_by(Messaggio.id_messaggio)
            if limit is not None:
                query = query.limit(limit)
            return query.all()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca di tutte le messaggio: {str(e)}")
            return list()

    def find_all_by_id(self, id_messaggio: str) -> Union[Messaggio, None]:
        try:
            return self.messaggio.query.filter_by(_id_messaggio=id_messaggio).first()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None

    def find_all_by_id_chat_and_child(self, id_child: str, id_chat: str, limit: Union[int, None] = None) \
            -> Tuple[Union[List[Messaggio], None], Union[int, None]]:
        try:
            list_message = []
            message2 = (self.messaggio.query.filter_by(_id_chat=id_chat, _id_bambino=id_child,
                                                       _versione_messaggio=None).limit(limit)
                        .order_by(self.messaggio._index_message).all())
            for message in message2:
                mes = self.messaggio.query.filter_by(_id_chat=id_chat, _id_bambino=id_child,
                                                     _versione_messaggio=message.id_messaggio).all()
                elem = message.to_dict(is_text_list=True)
                list_message.append(elem)
                if elem.__len__() > 0:
                    for m in mes:
                        list_message[-1]['testo'].append((m.id_messaggio, m.testo))

                        if message.versione_corrente == 0 and m.versione_corrente == 1:
                            list_message[-1]['versione_corrente'] = len(list_message[-1]['testo'])
            count = self.messaggio.query.filter_by(_id_chat=id_chat, _id_bambino=id_child,
                                                   _versione_corrente=1).count()
            return list_message, count
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None, None

    def trova_max_index(self,) -> int | None:
        try:
            return self.database.query(Messaggio).count()
        except SQLAlchemyError as e:
            if hasattr(current_app, 'web_logger'):
                current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
