from typing import Union, List, Type, Tuple

from model.dao.messaggio_dao import MessaggioDao
from model.entity.messaggio import Messaggio


class MessaggioService:

    def __init__(self) -> None:
        self.__messaggio_dao = MessaggioDao()

    def insert(self, messaggio: Union[Messaggio, List[Messaggio]]) -> Messaggio:
        return self.__messaggio_dao.insert(messaggio)

    def delete(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__messaggio_dao.delete(messaggio)

    def update(self, messaggio: Union[Messaggio, List[Messaggio]]) -> None:
        self.__messaggio_dao.update(messaggio)

    def find_all(self, limit: int | None = None) -> list[Type[Messaggio]]:
        return self.__messaggio_dao.find_all(limit)

    def find_all_by_id(self, id_messaggio: str) -> Union[Messaggio, None]:
        return self.__messaggio_dao.find_all_by_id(id_messaggio)

    def find_all_by_id_chat_and_child(self, id_child: str,  id_chat: str, limit: Union[int, None] = None) \
            -> Tuple[Union[List[Messaggio], None], Union[int, None]]:
        return self.__messaggio_dao.find_all_by_id_chat_and_child(id_child, id_chat, limit)

    def trova_max_index(self, ) -> int | None:
        return self.__messaggio_dao.trova_max_index()
