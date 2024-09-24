import uuid

from model.dao.base_dao import BaseDao
from typing import List, Union
from abc import ABC
from injector import inject
from model.repository.bambino_repository import BambinoReposistory
from model.entity.bambino import Bambino


class BambinoDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = BambinoReposistory()

    def insert(self, bambino: Union[Bambino, List[Bambino]]) -> None:
        self.__repository.insert(bambino)

    def delete_bambino(self, bambino: Union[Bambino, list[Bambino]]) -> None:
        self.__repository.delete(bambino)

    def update(self, bambino: Union[Bambino, List[Bambino]]) -> None:
        self.__repository.update(bambino)

    def find_all(self, limit: Union[int, None]) -> List[Bambino] | None:
        return self.__repository.find_all(limit)

    def delete(self, bambino: Union[Bambino, List[Bambino]]) -> None:
        self.__repository.delete(bambino)

    def find_all_by_id(self, id_bambino: uuid, type_search: Union[str, None] = None) -> Union[List[Bambino], None]:
        return self.__repository.find_all_by_id(id_bambino, type_search)

    def find_by_username_and_password(self, username, password):
        return self.__repository.find_by_username_and_password(username, password)
