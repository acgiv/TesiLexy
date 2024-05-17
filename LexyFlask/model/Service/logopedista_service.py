from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.logopedista_dao import LogopedistaDao
from model.entity.logopedista import Logopedista


class LogopedistaServiceInterface(ABC):
    @abstractmethod
    def insert_logopedista(self, entity):
        pass

    @abstractmethod
    def delete_logopedista(self, entity):
        pass

    @abstractmethod
    def update_logopedista(self, entity):
        pass

    @abstractmethod
    def get_find_all_logopedista(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def get_find_all_by_id_logopedista(self, id_entity: int) -> Union[List, None]:
        pass


class LogopedistaService(LogopedistaServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__logopedista_dao = LogopedistaDao()

    def insert_logopedista(self, logopedista:  Union[Logopedista, List[Logopedista]]):
        self.__logopedista_dao.insert(logopedista)

    def delete_logopedista(self, logopedista:  Union[Logopedista, List[Logopedista]]):
        self.__logopedista_dao.delete(logopedista)

    def update_logopedista(self, logopedista:  Union[Logopedista, List[Logopedista]]):
        self.__logopedista_dao.update(logopedista)

    def get_find_all_logopedista(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__logopedista_dao.find_all(limit)

    def get_find_all_by_id_logopedista(self, id_logopedista: int) -> Union[List, None]:
        return self.__logopedista_dao.find_all_by_id(id_logopedista)

    def find_by_username_and_password(self, username: str, password: str) -> Union[Logopedista, None]:
        return self.__logopedista_dao.find_by_username_and_password(username, password)
