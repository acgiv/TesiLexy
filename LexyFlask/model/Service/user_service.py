from abc import ABC, abstractmethod
from typing import Union, List

from injector import inject

from ..dao.utente_dao import UtenteDao
from ..entity.utente import Utente


class UtenteServiceInterface(ABC):
    @abstractmethod
    def insert_utente(self, entity):
        pass

    @abstractmethod
    def delete_utente(self, entity):
        pass

    @abstractmethod
    def update_utente(self, entity):
        pass

    @abstractmethod
    def get_find_all_utente(self, limit: Union[int, None]) -> Union[List, None]:
        pass

    @abstractmethod
    def get_find_all_by_id_utente(self, id_entity: int) -> Union[List, None]:
        pass


class UtenteService(UtenteServiceInterface, ABC):
    @inject
    def __init__(self):
        self.__utente_dao = UtenteDao()

    def insert_utente(self, utente: Union[Utente, List[Utente]]):
        self.__utente_dao.insert(utente)

    def delete_utente(self, utente: Union[Utente, List[Utente]]):
        self.__utente_dao.delete(utente)

    def update_utente(self, utente: Union[Utente, List[Utente]]):
        self.__utente_dao.update(utente)

    def get_find_all_utente(self, limit: Union[int, None]) -> Union[List, None]:
        return self.__utente_dao.find_all(limit)

    def get_find_all_by_id_utente(self, id_utente: int) -> Union[Utente, None]:
        return self.__utente_dao.find_all_by_id(id_utente)

    def find_by_username_and_password(self, username: str, password: str) -> Union[Utente, None]:
        return self.__utente_dao.find_by_username_and_password(username, password)

    def find_by_username(self, username: str) -> Union[Utente, None]:
        return self.__utente_dao.find_by_username(username)

    def find_by_email(self, email: str) -> Union[Utente, None]:
        return self.__utente_dao.find_by_email(email)

    def find_all_email_therapist(self, type_user: str) -> Union[List[str], None]:
        return self.__utente_dao.find_all_email_therapist(type_user=type_user)


