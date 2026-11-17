from datetime import datetime, timezone
from typing import Annotated

from pydantic import BeforeValidator


def add_utc_timezone(value):
    # SQLite returns naive dates; our database convention is always UTC.
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)
    return value


UTCDateTime = Annotated[datetime, BeforeValidator(add_utc_timezone)]
