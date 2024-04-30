from abc import ABC, abstractmethod
from typing import List, Union


class BaseDao(ABC):
    @abstractmethod
    def insert(self, entity):
        pass

    @abstractmethod
    def delete(self, entity):
        pass

    @abstractmethod
    def update(self, entity):
        pass

    @abstractmethod
    def find_all(self, limit: Union[int, None]) -> Union[List,  None]:
        pass

    @abstractmethod
    def find_all_by_id(self, id_entity: int) -> Union[List, None]:
        pass
