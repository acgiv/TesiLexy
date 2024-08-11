from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.patologia_dao import PatologiaDao
from model.entity.patologia import Patologia


class PatologiaServiceInterface(ABC):
    @abstractmethod
    def insert_patologia(self, entity):
        pass

    @abstractmethod
    def delete_patologia(self, entity):
        pass

    @abstractmethod
    def update_patologia(self, entity):
        pass

    @abstractmethod
    def get_find_all_patologia(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def get_find_all_by_id_patologia(self, id_entity: int) -> Union[List, None]:
        pass


class PatologiaService(PatologiaServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__patologia_dao = PatologiaDao()

    def insert_patologia(self, patologia:  Union[Patologia, List[Patologia]]):
        self.__patologia_dao.insert(patologia)

    def delete_patologia(self, patologia:  Union[Patologia, List[Patologia]]):
        self.__patologia_dao.delete(patologia)

    def update_patologia(self, patologia:  Union[Patologia, List[Patologia]]):
        self.__patologia_dao.update(patologia)

    def get_find_all_patologia(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__patologia_dao.find_all(limit)

    def get_find_all_by_id_patologia(self, id_patologia: int) -> Union[List, None]:
        return self.__patologia_dao.find_all_by_id(id_patologia)
