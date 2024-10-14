from typing import List, Union
from abc import ABC
from injector import inject
from model.repository.frasi_repository import FraseRepository
from model.entity.frase import Frase


class FraseDao(ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = FraseRepository()

    def insert(self, frasi: Union[Frase, List[Frase]]) -> Union[Frase, List[Frase], None]:
        return self.__repository.insert(frasi)

    def delete_frasi(self, frasi: Union[Frase, list[Frase]]) -> None:
        self.__repository.delete(frasi)

    def update(self, frasi: Union[Frase, List[Frase]]) -> None:
        self.__repository.update(frasi)

    def find_all(self, limit: Union[int, None]) -> List[Frase] | None:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_frase: int) -> Union[Frase, None]:
        return self.__repository.find_all_by_id(id_frase)

    def find_by_testo(self, testo: str) -> Union[Frase, None]:
        return self.__repository.find_by_testo(testo)
