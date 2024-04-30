from abc import ABC
from typing import List, Union

from injector import inject
from model.repository.logopedista_repository import LogopedistaRepository
from model.dao.base_dao import BaseDao
from model.entity.logopedista import Logopedista


class LogopedistaDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = LogopedistaRepository()

    def insert(self, logopedista: Union[Logopedista, List[Logopedista]]) -> None:
        self.__repository.insert(logopedista)

    def delete_logopedista(self, logopedista: Union[Logopedista, list[Logopedista]]) -> None:
        self.__repository.delete(logopedista)

    def update(self, logopedista: Union[Logopedista, List[Logopedista]]) -> None:
        self.__repository.update(logopedista)

    def find_all(self, limit: Union[int, None]) -> List[Logopedista] | None:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_logopedista: int) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_logopedista)

