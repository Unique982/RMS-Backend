import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { QueryTypes } from "sequelize";

class BookingTable {
  static async createReservation(req: Request, res: Response) {
    const {
      name,
      phoneNumber,
      table_id,
      guests,
      reservation_date,
      reservation_time,
      specailRequest,
      status,
    } = req.body;

    //
    if (
      !name ||
      !phoneNumber ||
      !table_id ||
      !guests ||
      !reservation_date ||
      !reservation_time ||
      !specailRequest
    )
      return res.status(400).json({ message: "All field required" });
    console.log(req.body);
    const tableStatus = await sequelize.query(
      `SELECT id, tableStatus,seats FROM tables WHERE id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [table_id],
      }
    );
    const table = (tableStatus as any)[0];
    if (table.tableStatus === "unavailable")
      return res
        .status(400)
        .json({ message: "Sorry, this table is unavailable" });

    // total number of guests == totalnumber seats seata kati janna xa ai guest katijanna xan
    if (guests > table.seats)
      return res.status(400).json({
        message: `Sorry, this table can accommodate only ${table.seats} guests`,
      });

    // user select garay ko tyo date ma kunai user la table booked garay ko xa ki nai

    const existingReservation = await sequelize.query(
      `SELECT id FROM reservations WHERE table_id = ?
  AND reservation_date = ?
  AND status IN ('pending','booking')
  AND reservation_time < ADDTIME(?, '01:00:00')
  AND ADDTIME(reservation_time, '01:00:00') > ? `,
      {
        type: QueryTypes.SELECT,
        replacements: [
          table_id,
          reservation_date,
          reservation_time,
          reservation_time,
        ],
      }
    );
    if (reservation_time < "10:00:00" || reservation_time >= "20:00:00")
      return res.status(400).json({
        message: "Reservation time must be between 10:00 AM  and 08:00 Pm",
      });

    if (existingReservation.length > 0)
      return res.status(400).json({
        message: "Sorry, this table is already booked for that date & time",
      });

    // insert query

    await sequelize.query(
      `INSERT INTO reservations(user_id,table_id,guests,reservation_date,reservation_time,status,  specailRequest,createdAt,updatedAt,name,phoneNumber)VALUES (?, ?, ?, ?, ?, ?, ?,NOW(), NOW(),?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          null,
          table_id,
          guests,
          reservation_date,
          reservation_time,
          "pending",
          specailRequest,
          name,
          phoneNumber,
        ],
      }
    );
    console.log();

    res.status(200).json({ message: "Reservation Booking successfully!" });
  }
}
export default BookingTable;
