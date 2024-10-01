
from typing import Union, List

from injector import inject

from model.entity.patologia import Patologia
from ..dao.tipologiatesto_dao import TipologiaTestoDao
from ..entity.tipologiaTesto import TipologiaTesto


class TipologiaTestoService:
    @inject
    def __init__(self):
        self.__patologia_dao = TipologiaTestoDao()

    def insert(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        self.__patologia_dao.insert(tipologia)

    def delete(self, tipologia: Union[TipologiaTesto, list[TipologiaTesto]]) -> None:
        self.__patologia_dao.delete(tipologia)

    def update_patologia(self, patologia:  Union[Patologia, List[Patologia]]):
        self.__patologia_dao.update(patologia)

    def update(self, tipologia: Union[TipologiaTesto, List[TipologiaTesto]]) -> None:
        self.__patologia_dao.update(tipologia)

    def find_all_by_id(self, id_tipologia: int) -> Union[TipologiaTesto, None]:
        return self.__patologia_dao.find_all_by_id(id_tipologia)

    def find_all(self, limit: Union[int, None]) -> List[TipologiaTesto] | None:
        return self.__patologia_dao.find_all(limit)

    def find_in_list(self, list_tipologia: list[str]) -> list[TipologiaTesto] | None:
        return self.__patologia_dao.find_in_list(list_tipologia)

    def find_id_by_name(self, nome: str) -> Union[int, None]:
        return self.__patologia_dao.find_id_by_name(nome)
