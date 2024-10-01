from model.dao.base_dao import BaseDao
from typing import List, Union
from abc import ABC
from injector import inject

from model.entity.testo import TestoOriginale
from model.repository.testo_reposistory import TestoOriginaleRepository


class TestoOriginaleDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = TestoOriginaleRepository()

    def insert(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__repository.insert(testo)

    def delete(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__repository.delete(testo)

    def update(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__repository.update(testo)

    def find_all(self, limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        return self.__repository.find_all(limit)

    def find_by_id(self, id_testo: int) -> Union[TestoOriginale, None]:
        return self.__repository.find_by_id(id_testo)

    def find_by_titolo(self, titolo: str) -> Union[TestoOriginale, None]:
        return self.__repository.find_by_titolo(titolo)

    def find_by_tipologia(self, tipologia: str,  limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        return self.__repository.find_by_tipologia(tipologia, limit)
