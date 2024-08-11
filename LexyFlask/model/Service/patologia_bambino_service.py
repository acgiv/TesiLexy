from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.Patologia_bambino_dao import PatologiaBambinoDao
from model.entity.patologiaBambino import PatologiaBambino


class PatologiaBambinoServiceInterface(ABC):
    @abstractmethod
    def insert_patologia_bambino(self, entity):
        pass

    @abstractmethod
    def delete_patologia_bambino(self, entity):
        pass

    @abstractmethod
    def update_patologia_bambino(self, entity):
        pass

    @abstractmethod
    def get_find_all_patologia_bambino(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def get_find_all_by_id_patologia_bambino(self, id_entity: int) -> Union[List, None]:
        pass


class PatologiaBambinoService(PatologiaBambinoServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__patologia_bambino_dao = PatologiaBambinoDao()

    def insert_patologia_bambino(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.insert(patologia_bambino)

    def delete_patologia_bambino(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.delete(patologia_bambino)

    def update_patologia_bambino(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.update(patologia_bambino)

    def get_find_all_patologia_bambino(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__patologia_bambino_dao.find_all(limit)

    def get_find_all_by_id_patologia_bambino(self, id_patologia_bambino: int) -> Union[List, None]:
        return self.__patologia_bambino_dao.find_all_by_id(id_patologia_bambino)