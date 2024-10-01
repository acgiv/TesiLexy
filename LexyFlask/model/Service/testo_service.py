from typing import List, Union
from injector import inject

from model.dao.testo_dao import TestoOriginaleDao
from model.entity.testo import TestoOriginale


class TestoOriginaleService:
    @inject
    def __init__(self) -> None:
        self.__dao = TestoOriginaleDao()

    def insert(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__dao.insert(testo)

    def delete(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__dao.delete(testo)

    def update(self, testo: Union[TestoOriginale, List[TestoOriginale]]) -> None:
        self.__dao.update(testo)

    def find_all(self, limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        return self.__dao.find_all(limit)

    def find_by_id(self, id_testo: int) -> Union[TestoOriginale, None]:
        return self.__dao.find_by_id(id_testo)

    def find_by_titolo(self, titolo: str) -> Union[TestoOriginale, None]:
        return self.__dao.find_by_titolo(titolo)

    def find_by_tipologia(self, tipologia: str,  limit: Union[int, None]) -> Union[List[TestoOriginale], None]:
        return self.__dao.find_by_tipologia(tipologia, limit)
