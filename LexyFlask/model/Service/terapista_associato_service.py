import uuid
from typing import List, Union

from model.Service.user_service import UtenteService
from model.dao.terapista_associato_dao import BambinoAssociatoDao
from model.entity.terapista_associato import TerapistaAssociato


class TerapistaAssociatoService:
    def __init__(self):
        self.__bambino_associato_dao = BambinoAssociatoDao()

    def insert(self, bambino_associato: Union[TerapistaAssociato, List[TerapistaAssociato]]):
        self.__bambino_associato_dao.insert(bambino_associato)

    def delete(self, bambino_associato: Union[TerapistaAssociato, List[TerapistaAssociato]]):
        self.__bambino_associato_dao.delete(bambino_associato)

    def update(self, bambino_associato: Union[TerapistaAssociato, List[TerapistaAssociato]]):
        self.__bambino_associato_dao.update(bambino_associato)

    def get_find_all_bambino_associato(self, limit: Union[int, None]) -> Union[List[TerapistaAssociato], None]:
        return self.__bambino_associato_dao.find_all(limit)

    def find_all_by_id(self, id_search:  uuid, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__bambino_associato_dao.find_all_by_id(id_search, type_search)

    def find_by_email_terapista(self, id_search: uuid) -> Union[List[str], None]:
        return self.__bambino_associato_dao.find_by_email_terapista(id_search)

    def find_all_terapisti_associati(self, id_search: uuid, id_terapista: uuid) ->\
            Union[List[TerapistaAssociato], None]:
        return self.__bambino_associato_dao.find_all_terapisti_associati(id_search, id_terapista)

    def find_all_terapista_by_email(self, email_search: str) -> Union[TerapistaAssociato, None]:
        return self.__bambino_associato_dao.find_all_terapista_by_email(email_search)

    def update_terapisti_associati(self, id_search: uuid, id_terapista: uuid, lista_update: List[str]) -> None:
        ut = UtenteService()
        lista_terapisti = self.find_all_terapisti_associati(id_search=id_search, id_terapista=id_terapista)
        if lista_terapisti:
            for el in lista_terapisti:
                if lista_update and el[1] in lista_update:
                    lista_update.remove(el[1])
                else:
                    self.delete(el[0])
        if lista_update:
            for email in lista_update:
                self.insert(TerapistaAssociato(idterapista=ut.find_by_email(email=email).id_utente,
                                               idbambino=id_search))
