from typing import List, Type, Union
from injector import inject
from model.repository.chat_repository import ChatRepository
from model.dao.base_dao import BaseDao
from model.entity.chat import Chat


class ChatDao(BaseDao):
    @inject
    def __init__(self) -> None:
        self.__repository = ChatRepository()

    def insert(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.insert(chat)

    def delete(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.delete(chat)

    def update(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__repository.update(chat)

    def find_all(self, limit: int | None = None) -> list[Type[Chat]]:
        return self.__repository.find_all(limit)

    def find_all_by_id(self, id_chat: int, type_search: Union[str, None] = None) -> Union[List, None]:
        return self.__repository.find_all_by_id(id_chat, type_search=type_search)

