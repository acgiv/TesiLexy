from typing import List, Union

from injector import inject

from model.repository.patologia_reposistory import PatologiaReposistory
from model.dao.base_dao import BaseDao
from model.entity.patologia import Patologia


class PatologiaDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = PatologiaReposistory()

    def insert(self, patologia: Union[Patologia, List[Patologia]]) -> None:
        self.__repository.insert(patologia)

    def delete(self, patologia: Union[Patologia, List[Patologia]]) -> None:
        self.__repository.delete(patologia)

    def update(self, patologia: Union[Patologia, List[Patologia]]) -> None:
        self.__repository.update(patologia)

    def find_all_by_id(self, id_patologia: int, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_patologia, type_search=type_search)

    def find_all(self, limit: int | None = None) -> list[Patologia] | None:
        return self.__repository.find_all(limit)

    def find_in_list(self, list_patologia: list[str]) -> list[Patologia] | None:
        return self.__repository.find_in_list(list_patologia=list_patologia)

    def find_id_by_name(self, nome_patologia: str) -> Union[int, None]:
        return self.__repository.find_id_by_name(nome_patologia=nome_patologia)
