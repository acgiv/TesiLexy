from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.terapista_dao import TerapistaDao
from model.entity.terapista import Terapista


class TerapistaServiceInterface(ABC):
    @abstractmethod
    def insert_terapista(self, entity):
        pass

    @abstractmethod
    def delete_terapista(self, entity):
        pass

    @abstractmethod
    def update_terapista(self, entity):
        pass

    @abstractmethod
    def get_find_all_terapista(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def get_find_all_by_id_terapista(self, id_entity: int) -> Union[List, None]:
        pass


class TerapistaService(TerapistaServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__terapista_dao = TerapistaDao()

    def insert_terapista(self, terapista:  Union[Terapista, List[Terapista]]):
        self.__terapista_dao.insert(terapista)

    def delete_terapista(self, terapista:  Union[Terapista, List[Terapista]]):
        self.__terapista_dao.delete(terapista)

    def update_terapista(self, terapista:  Union[Terapista, List[Terapista]]):
        self.__terapista_dao.update(terapista)

    def get_find_all_terapista(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__terapista_dao.find_all(limit)

    def get_find_all_by_id_terapista(self, id_terapista: int) -> Union[List, None]:
        return self.__terapista_dao.find_all_by_id(id_terapista)

    def find_by_username_and_password(self, username: str, password: str) -> Union[Terapista, None]:
        return self.__terapista_dao.find_by_username_and_password(username, password)
