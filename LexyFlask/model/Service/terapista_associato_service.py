import uuid
from typing import List, Union
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

    def find_all_by_id(self, id_search: uuid, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__bambino_associato_dao.find_all_by_id(id_search, type_search)

    def find_by_email_terapista(self, id_search: uuid, ) -> Union[List[str], None]:
        return self.__bambino_associato_dao.find_by_email_terapista(id_search)
