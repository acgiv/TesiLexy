from abc import ABC
from typing import List, Type, Union

from injector import inject
from model.repository.messaggio_repository import MessaggioRepository
from model.dao.base_dao import BaseDao
from model.entity.messaggio import Messaggio


class MessaggioDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = MessaggioRepository()

    def insert(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__repository.insert(messaggio)

    def delete(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__repository.delete(messaggio)

    def update(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__repository.update(messaggio)

    def find_all(self, limit: int | None = None) -> list[Type[Messaggio]]:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_messaggio: str, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_messaggio, type_search=type_search)

    def find_all_by_id_chat_and_child(self, id_child: str,  id_chat: str, limit: Union[int, None] = None)\
            -> Union[List[Messaggio], None]:
        return self.__repository.find_all_by_id_chat_and_child(id_child, id_chat, limit)
