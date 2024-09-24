from typing import List, Type, Union

from injector import inject

from model.repository.versione_messaggio_repository import VersioneMessaggioRepository
from model.dao.base_dao import BaseDao
from model.entity.versione_messaggio import VersioneMessaggio


class VersioneMessaggioDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = VersioneMessaggioRepository()

    def insert(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        self.__repository.insert(versione_messaggio)

    def delete(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        self.__repository.delete(versione_messaggio)

    def update(self, versione_messaggio: Union[VersioneMessaggio, List[VersioneMessaggio]]) -> None:
        self.__repository.update(versione_messaggio)

    def find_all_by_id(self, id_versione_messaggio: int, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_versione_messaggio, type_search=type_search)

    def find_all(self, limit: int | None = None) -> list[Type[VersioneMessaggio]]:
        return self.__repository.find_all(limit)
