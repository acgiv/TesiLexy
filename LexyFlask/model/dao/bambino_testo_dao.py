from typing import List, Union
from injector import inject
import uuid
from model.entity.bambino_testo import BambinoTesto
from model.repository.bambino_testo_repository import BambinoTestoRepository
from model.dao.base_dao import BaseDao


class BambinoTestoDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = BambinoTestoRepository()

    def insert(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__repository.insert(bambino_testo)

    def delete(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__repository.delete(bambino_testo)

    def update(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__repository.update(bambino_testo)

    def find_all(self, limit: int | None = None) -> List[BambinoTesto] | None:
        return self.__repository.find_all(limit)

    def find_by_idbambino(self, idbambino: uuid.UUID) -> Union[List[BambinoTesto], None]:
        return self.__repository.find_by_idbambino(idbambino)

    def find_by_idtesto(self, idtesto: uuid.UUID) -> Union[List[BambinoTesto], None]:
        return self.__repository.find_by_idtesto(idtesto)

    def find_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: int) -> Union[BambinoTesto, None]:
        return self.__repository.find_by_bambino_and_testo(idbambino, idtesto)

    def delete_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: uuid.UUID) -> None:
        self.__repository.delete_by_bambino_and_testo(idbambino, idtesto)

    def count_test_assocati(self, idbambino: uuid.UUID) -> Union[int, None]:
        return self.__repository.count_test_assocati(idbambino)
