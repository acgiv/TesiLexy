from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.bambino_dao import BambinoDao
from model.entity.bambino import Bambino


class BambinoServiceInterface(ABC):
    @abstractmethod
    def insert_bambino(self, entity):
        pass

    @abstractmethod
    def delete_bambino(self, entity):
        pass

    @abstractmethod
    def update_bambino(self, entity):
        pass

    @abstractmethod
    def get_find_all_bambino(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def get_find_all_by_id_bambino(self, id_entity: int) -> Union[List, None]:
        pass


class BambinoService(BambinoServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__bambino_dao = BambinoDao()

    def insert_bambino(self, bambino:  Union[Bambino, List[Bambino]]):
        self.__bambino_dao.insert(bambino)

    def delete_bambino(self, bambino:  Union[Bambino, List[Bambino]]):
        self.__bambino_dao.delete(bambino)

    def update_bambino(self, bambino:  Union[Bambino, List[Bambino]]):
        self.__bambino_dao.update(bambino)

    def get_find_all_bambino(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__bambino_dao.find_all(limit)

    def get_find_all_by_id_bambino(self, id_bambino: int) -> Union[Bambino, None]:
        return self.__bambino_dao.find_all_by_id(id_bambino)

    def find_by_username_and_password(self, username: str, password: str) -> Union[Bambino, None]:
        return self.__bambino_dao.find_by_username_and_password(username, password)
