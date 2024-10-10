from typing import Union, List, Type

from model.dao.messaggio_dao import MessaggioDao
from model.entity.messaggio import Messaggio


class MessaggioService:

    def __init__(self) -> None:
        self.__messaggio_dao = MessaggioDao()

    def insert(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__messaggio_dao.insert(messaggio)

    def delete(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__messaggio_dao.delete(messaggio)

    def update(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__messaggio_dao.update(messaggio)

    def find_all(self, limit: int | None = None) -> list[Type[Messaggio]]:
        return self.__messaggio_dao.find_all(limit)

    def find_all_by_id(self, id_messaggio: str, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__messaggio_dao.find_all_by_id(id_messaggio, type_search=type_search)

    def find_all_by_id_chat_and_child(self, id_child: str,  id_chat: str, limit: Union[int, None] = None)\
            -> Union[List[Messaggio], None]:
        return self.__messaggio_dao.find_all_by_id_chat_and_child(id_child, id_chat, limit)

