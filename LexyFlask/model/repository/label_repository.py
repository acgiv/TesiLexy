from abc import ABC

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from model.dao.base_dao import BaseDao
from model.entity.label import Label
from extensions import db
from typing import List, Union


class LabelRepository(BaseDao, ABC):

    def __init__(self) -> None:
        self.database = db.session

    def insert(self, label: Label | List[Label]) -> None:
        print(label)
        if isinstance(label, Label):
            current_app.api_logger.info(f"salvo lo label {label}")
            self.database.add(label)
        elif isinstance(label, List):
            self.database.add_all(label)
        self.database.commit()

    def delete(self, label: Label | List[Label]) -> None:
        if isinstance(label, Label):
            self.database.delete(label)
        elif isinstance(label, List):
            for component in label:
                self.database.delete(component)
        self.database.commit()

    def update_label(self, label: Label | List[Label]) -> None:
        if isinstance(label, Label):
            self.database.merge(label)
        elif isinstance(label, List):
            for u in label:
                self.database.merge(u)
        self.database.commit()

    def find_all(self, limit: int | None) -> List[Label] | None:
        return Label.query.order_by(Label.id_label).limit(limit).all()

    def find_all_by_id(self, id_entity: int) -> Union[List, None]:
        try:
            return Label.query.filter_by(_id_label=id_entity).first()
        except SQLAlchemyError as e:
            current_app.web_logger.error(f"Errore durante la ricerca per ID: {str(e)}")
            return None
