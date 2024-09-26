from typing import List, Union
from injector import inject
import uuid
from model.entity.terapista_associato import TerapistaAssociato
from model.repository.terapista_associato_repository import TerapistaAssociatoRepository
from model.dao.base_dao import BaseDao
from model.entity.chat import Chat


class BambinoAssociatoDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = TerapistaAssociatoRepository()

    def insert(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.insert(chat)

    def delete(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.delete(chat)

    def update(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.update(chat)

    def find_all(self, limit: int | None = None) -> list[TerapistaAssociato] | None:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_search: uuid, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_search, type_search)

    def find_by_email_terapista(self, id_search: uuid, ) -> Union[List[str], None]:
        return self.__repository.find_by_email_terapista(id_search)

    def find_all_terapisti_associati(self, id_search: uuid, id_terapista: uuid) -> Union[List[TerapistaAssociato], None]:
        return self.__repository.find_all_terapisti_associati(id_search, id_terapista)

    def find_all_terapista_by_email(self, email_search: str) -> Union[TerapistaAssociato, None]:
        return self.__repository.find_all_terapista_by_email(email_search)
