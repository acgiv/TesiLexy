from typing import List, Union

from injector import inject

from model.entity.tipologiaTesto import TipologiaTesto
from model.dao.base_dao import BaseDao
from model.repository.tipologiatesto_toreposistory import TipologiaTestoReposistory


class TipologiaTestoDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = TipologiaTestoReposistory()

    def insert(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        self.__repository.insert(tipologia)

    def delete(self, tipologia: Union[TipologiaTesto, list[TipologiaTesto]]) -> None:
        self.__repository.delete(tipologia)

    def update(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        self.__repository.update(tipologia)

    def find_all_by_id(self, id_tipologia: int, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_tipologia, type_search=type_search)

    def find_all(self, limit: Union[int, None]) -> List[TipologiaTesto] | None:
        return self.__repository.find_all(limit)

    def find_in_list(self, list_tipologia: list[str]) -> list[TipologiaTesto] | None:
        return self.__repository.find_in_list(list_tipologia)

    def find_id_by_name(self, nome: str) -> Union[List, None]:
        return self.__repository.find_id_by_name(nome)
