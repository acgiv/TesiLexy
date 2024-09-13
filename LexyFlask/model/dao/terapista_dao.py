from abc import ABC
from typing import List, Union

from injector import inject
from model.repository.terapista_repository import TerapistaRepository
from model.dao.base_dao import BaseDao
from model.entity.terapista import Terapista


class TerapistaDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = TerapistaRepository()

    def insert(self, terapista: Union[Terapista, List[Terapista]]) -> None:
        self.__repository.insert(terapista)

    def delete_terapista(self, terapista: Union[Terapista, list[Terapista]]) -> None:
        self.__repository.delete(terapista)

    def update(self, terapista: Union[Terapista, List[Terapista]]) -> None:
        self.__repository.update(terapista)

    def find_all(self, limit: Union[int, None]) -> List[Terapista] | None:
        return self.__repository.find_all(limit)

    def delete(self, terapista: Union[Terapista, List[Terapista]]) -> None:
        self.__repository.delete(terapista)

    def find_all_by_id(self, id_terapista: int) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_terapista)
