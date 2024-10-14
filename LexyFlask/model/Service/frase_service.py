from typing import Union, List

from model.dao.frase_dao import FraseDao
from model.entity.frase import Frase


class FraseService:
    def __init__(self) -> None:
        self.__frasi_dao = FrasiDao()

    def insert(self, frasi: Union[Frase, List[Frase]]) -> Union[Frase, List[Frase], None]:
        return self.__frasi_dao.insert(frasi)

    def delete(self, frasi: Union[Frase, List[Frase]]) -> None:
        self.__frasi_dao.delete_frasi(frasi)

    def update(self, frasi: Union[Frase, List[Frase]]) -> None:
        self.__frasi_dao.update(frasi)

    def find_all(self, limit: int | None = None) -> list[Frase] | None:
        return self.__frasi_dao.find_all(limit)

    def find_all_by_id(self, id_frase: int) -> Union[Frase, None]:
        return self.__frasi_dao.find_all_by_id(id_frase)

    def find_by_testo(self, testo: str) -> Union[Frase, None]:
        return self.__frasi_dao.find_by_testo(testo)