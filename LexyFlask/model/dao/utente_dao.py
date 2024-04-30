from abc import ABC
from typing import Union, List
from injector import inject
from model.repository.utente_repository import UtenteRepository
from model.dao.base_dao import BaseDao
from model.entity.utente import Utente


class UtenteDao(BaseDao, ABC):
    @inject
    def __init__(self) -> None:
        self.__repository = UtenteRepository()

    def insert(self, utente: Union[Utente, List[Utente]]) -> None:
        self.__repository.insert(utente)

    def delete(self, utente: Union[Utente, List[Utente]]) -> None:
        self.__repository.delete(utente)

    def update(self, utente: Union[Utente, List[Utente]]) -> None:
        self.__repository.update(utente)

    def find_all(self, limit: Union[int, None]) -> Union[List[Utente],  None]:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_utente: int) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_utente)

    def find_by_username_and_password(self, username: str, password: str) -> Union[Utente, None]:
        return self.__repository.find_by_username_and_password(username, password)
