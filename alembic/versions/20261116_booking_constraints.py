"""Add seat and active booking uniqueness constraints."""

from alembic import op
import sqlalchemy as sa


revision = "20261116_booking"
down_revision = "09edc8d8f9e0"
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    duplicate_seat = connection.execute(sa.text(
        "SELECT 1 FROM seats GROUP BY hall_id, row_number, seat_number "
        "HAVING COUNT(*) > 1 LIMIT 1"
    )).first()
    duplicate_booking = connection.execute(sa.text(
        "SELECT 1 FROM tickets WHERE status = 'booked' "
        "GROUP BY showtime_id, seat_id HAVING COUNT(*) > 1 LIMIT 1"
    )).first()

    if duplicate_seat or duplicate_booking:
        raise RuntimeError(
            "Existing duplicate seats or bookings must be resolved before "
            "applying uniqueness constraints. No records were deleted."
        )

    with op.batch_alter_table("seats") as batch_op:
        batch_op.create_unique_constraint(
            "unique_seat_in_hall",
            ["hall_id", "row_number", "seat_number"],
        )

    op.create_index(
        "unique_booked_seat",
        "tickets",
        ["showtime_id", "seat_id"],
        unique=True,
        sqlite_where=sa.text("status = 'booked'"),
    )


def downgrade():
    op.drop_index("unique_booked_seat", table_name="tickets")
    with op.batch_alter_table("seats") as batch_op:
        batch_op.drop_constraint("unique_seat_in_hall", type_="unique")
