from typing import List, Union

from injector import inject

from model.repository.patologia_bambino_repository import PatologiaBambinoReposistory
from model.dao.base_dao import BaseDao
from model.entity.patologiaBambino import PatologiaBambino


class PatologiaBambinoDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = PatologiaBambinoReposistory()

    def insert(self, patologia_bambino: Union[PatologiaBambino, List[PatologiaBambino]]) -> None:
        self.__repository.insert(patologia_bambino)

    def delete(self, patologia_bambino: Union[PatologiaBambino, List[PatologiaBambino]]) -> None:
        self.__repository.delete(patologia_bambino)

    def update(self, patologia_bambino: Union[PatologiaBambino, List[PatologiaBambino]]) -> None:
        self.__repository.update(patologia_bambino)

    def find_all_by_id(self, id_patologia: int, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_patologia, type_search=type_search)

    def find_all(self, limit: int | None = None) -> List[PatologiaBambino]:
        return self.__repository.find_all(limit)
