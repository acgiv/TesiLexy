from typing import Union, List, Type

from injector import inject

from model.entity.chat import Chat
from model.dao.chat_dao import ChatDao


class ChatService:
    @inject
    def __init__(self) -> None:
        self.__dao = ChatDao()

    def insert(self, chat: Union[Chat, List[Chat]]) -> Chat | list[Chat]:
        return self.__dao.insert(chat)

    def delete(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__dao.delete(chat)

    def update(self, chat: Union[Chat, List[Chat]]) -> None:
        self.__dao.update(chat)

    def find_all(self, limit: int | None = None) -> list[Type[Chat]]:
        return self.__dao.find_all(limit)

    def find_all_by_id(self, id_chat: str) -> Union[Chat, None]:
        return self.__dao.find_all_by_id(id_chat)

    def find_all_by_id_child(self, id_child: str,  limit: int | None = None) -> Union[List[Chat], None]:
        return self.__dao.find_all_by_id_child(id_child, limit)
