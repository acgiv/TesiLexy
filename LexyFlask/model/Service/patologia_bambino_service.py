from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from .patologia_service import PatologiaService
from ..dao.Patologia_bambino_dao import PatologiaBambinoDao
from model.entity.patologiaBambino import PatologiaBambino
import uuid


class PatologiaBambinoServiceInterface(ABC):
    @abstractmethod
    def insert_patologia_bambino(self, entity):
        pass

    @abstractmethod
    def delete(self, entity):
        pass

    @abstractmethod
    def update(self, entity):
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
        self.__patologie_service = PatologiaService()

    def insert_patologia_bambino(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.insert(patologia_bambino)

    def insert_patologie_bambino(self, id_bambino: str, patologie_bambino: List[str]):
        pa_bambino = list()
        for pa in patologie_bambino:
            id_patologia = self.__patologie_service.get_find_id_by_name(pa)
            if id_patologia:
                pa_bambino.append(PatologiaBambino(idbambino=id_bambino, idpatologia=id_patologia))
        self.__patologia_bambino_dao.insert(pa_bambino)

    def delete(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.delete(patologia_bambino)

    def update(self, patologia_bambino:  Union[PatologiaBambino, List[PatologiaBambino]]):
        self.__patologia_bambino_dao.update(patologia_bambino)

    def get_find_all_patologia_bambino(self,  limit: Union[int, None]) -> Union[List, None]:
        return self.__patologia_bambino_dao.find_all(limit)

    def get_find_by_id_bambino(self, id_bambino: uuid, limit: Union[int, None]) -> Union[List[PatologiaBambino], None]:
        return self.__patologia_bambino_dao.get_find_by_id_bambino(id_bambino, limit)

    def get_find_all_by_id_patologia_bambino(self, id_patologia_bambino: int) -> Union[int, None]:
        return self.__patologia_bambino_dao.find_all_by_id(id_patologia_bambino)

    def update_patologie(self, id_bambino: uuid, lista_patologie:[str]) -> None:
        pa = PatologiaService()
        lista_id_patologie = [pa.get_find_id_by_name(el) for el in lista_patologie]
        lista_id_pat_bambino = self.get_find_by_id_bambino(id_bambino, None)
        if lista_id_pat_bambino:
            for el in lista_id_pat_bambino:
                if lista_id_patologie and el.idpatologia in lista_id_patologie:
                    lista_id_patologie.remove(el.idpatologia)
                else:
                    self.delete(el)
        if lista_id_patologie:
            for id_patologia in lista_id_patologie:
                self.insert_patologia_bambino(PatologiaBambino(idbambino=id_bambino, idpatologia=id_patologia))

