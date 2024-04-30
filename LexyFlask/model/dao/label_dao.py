from abc import ABC
from injector import inject

from model.repository.label_repository import LabelRepository
from model.dao.base_dao import BaseDao
from model.entity.label import Label
from typing import List, Union


class LabelDao(BaseDao, ABC):

    @inject
    def __init__(self) -> None:
        self.__repository = LabelRepository()

    def insert(self, label: Label | List[Label]) -> None:
        self.__repository.insert(label)

    def delete(self, label: Label | List[Label]) -> None:
        self.__repository.delete(label)

    def update_label(self, label: Label | List[Label]) -> None:
        return self.__repository.update(label)

    def find_all(self, limit: int | None) -> List[Label] | None:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_label: int) -> Union[int, None]:
        return self.__repository.find_all_by_id(id_label)



