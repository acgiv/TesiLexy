import uuid
from typing import List, Union
from model.dao.bambino_testo_dao import BambinoTestoDao
from model.entity.bambino_testo import BambinoTesto


class BambinoTestoService:
    def __init__(self):
        self.__bambino_testo_dao = BambinoTestoDao()

    def insert(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__bambino_testo_dao.insert(bambino_testo)

    def delete(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__bambino_testo_dao.delete(bambino_testo)

    def update(self, bambino_testo: Union[BambinoTesto, List[BambinoTesto]]) -> None:
        self.__bambino_testo_dao.update(bambino_testo)

    def get_find_all_bambino_testo(self, limit: Union[int, None] = None) -> Union[List[BambinoTesto], None]:
        return self.__bambino_testo_dao.find_all(limit)

    def find_by_idbambino(self, idbambino: uuid.UUID) -> Union[List[BambinoTesto], None]:
        return self.__bambino_testo_dao.find_by_idbambino(idbambino)

    def find_by_idtesto(self, idtesto: uuid.UUID) -> Union[List[BambinoTesto], None]:
        return self.__bambino_testo_dao.find_by_idtesto(idtesto)

    def find_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: int) -> Union[BambinoTesto, None]:
        return self.__bambino_testo_dao.find_by_bambino_and_testo(idbambino, idtesto)

    def delete_by_bambino_and_testo(self, idbambino: uuid.UUID, idtesto: uuid.UUID) -> None:
        self.__bambino_testo_dao.delete_by_bambino_and_testo(idbambino, idtesto)

    def count_test_assocati(self, idbambino: uuid.UUID) -> Union[int, None]:
        return self.__bambino_testo_dao.count_test_assocati(idbambino)

