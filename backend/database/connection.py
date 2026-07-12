from __future__ import annotations

from typing import Any, Type

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from backend.config.settings import settings
from backend.database.models import (
    DOCUMENT_MODELS,
    MongoDocument,
)


_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.mongodb_url, serverSelectionTimeoutMS=settings.mongodb_timeout_ms)
    return _client


def get_database() -> Database:
    return get_client()[settings.mongodb_db_name]


def collection_for(model: Type[MongoDocument]) -> Collection:
    return get_database()[model.collection_name]


def init_db() -> None:
    get_client().admin.command("ping")
    _ensure_indexes()


def get_db():
    yield get_database()


def insert_document(db: Database, document: MongoDocument) -> MongoDocument:
    db[document.collection_name].insert_one(document.to_mongo())
    return document


def list_documents(
    db: Database,
    model: Type[MongoDocument],
    *,
    filter_query: dict[str, Any] | None = None,
    sort: list[tuple[str, int]] | None = None,
    limit: int | None = None,
) -> list[MongoDocument]:
    cursor = db[model.collection_name].find(filter_query or {})
    if sort:
        cursor = cursor.sort(sort)
    if limit:
        cursor = cursor.limit(limit)
    return [model.from_mongo(row) for row in cursor]


def count_documents(db: Database, model: Type[MongoDocument], filter_query: dict[str, Any] | None = None) -> int:
    return db[model.collection_name].count_documents(filter_query or {})


def _ensure_indexes() -> None:
    directions = {-1: DESCENDING, 1: ASCENDING}
    db = get_database()
    for model in DOCUMENT_MODELS:
        for field_name, direction in model.indexes:
            db[model.collection_name].create_index([(field_name, directions[direction])])

