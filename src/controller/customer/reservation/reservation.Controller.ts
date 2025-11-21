import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
const convertTo24Hour = (time12: string) => {
  const [time, modifier] = time12.split(" "); // e.g., "2:00 PM"
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
};
class ReservationTable {
  static async createReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
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
    const time24 = convertTo24Hour(reservation_time);
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
        replacements: [userId, table_id, reservation_date, time24, time24],
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

    const existingPhone = await sequelize.query(
      `SELECT id  FROM reservations
     WHERE phoneNumber = ?
     AND reservation_date = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [phoneNumber, reservation_date],
      }
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({
        message: "This phone number already has a booking on this date.",
      });
    }

    // insert query

    await sequelize.query(
      `INSERT INTO reservations(user_id,table_id,guests,reservation_date,reservation_time,status,specailRequest,createdAt,updatedAt)VALUES(?,?,?,?,?,?,?,NOW(),NOW(),?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          userId,
          table_id,
          guests,
          reservation_date,
          time24,
          status,
          specailRequest,
          name,
          phoneNumber,
        ],
      }
    );
    console.log();

    res.status(200).json({ message: "Reservation Booking successfully!" });
  }
  static async getMyReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    // Check if user is logged in
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    // Fetch reservations for this user only
    const reservationData = await sequelize.query(
      `SELECT r.*, u.username, u.id, t.tableNumber
     FROM reservations r
     JOIN users u ON r.user_id = u.id
     JOIN tables t ON r.table_id = t.id
     WHERE r.user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [userId],
      }
    );

    // Send JSON response
    res.status(200).json({ message: "Fetch all data", data: reservationData });
  }
  /// cancel
  static async statusChange(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const reservationId = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const exists = await sequelize.query(
      `SELECT id FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [reservationId],
      }
    );
    if (exists.length === 0)
      return res.status(400).json({ message: "Reservations id not found!" });
    // update
    const updated = await sequelize.query(
      `UPDATE reservations SET status = ? WHERE id = ? AND user_id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [status, reservationId, userId],
      }
    );
    if (!updated)
      return res
        .status(403)
        .json({ message: "You cannot update this reservation" });
    res.status(200).json({ message: "Update successfullY!" });
  }
  // delete
  static async deleteReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const reservationId = req.params.id;
    const exists = await sequelize.query(
      `SELECT id,status FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [reservationId],
      }
    );
    if (!exists || exists.length === 0)
      return res.status(400).json({ message: "Reservations id not found!" });

    const reservation = exists[0] as any;

    if (reservation.status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Only cancelled reservations can be deleted" });
    }

    // delete
    await sequelize.query(`DELETE  FROM reservations WHERE id = ?`, {
      replacements: [reservationId],
      type: QueryTypes.DELETE,
    });
    res.status(200).json({ message: "Reservation deleted successfully" });
  }

  // single view
  static async singleReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params;
    const existsId = await sequelize.query(
      `SELECT * FROM reservations WHERE id = ? AND user_id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id, userId],
      }
    );
    if (!existsId || existsId.length === 0) {
      return res.status(404).json({ message: "Reservation id not found!" });
    } else {
      res
        .status(200)
        .json({ message: "single reservation fetch!", data: existsId });
    }
  }
  //update
  static async updateReservationDate(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      table_id,
      guests,
      reservation_date,
      reservation_time,
      specailRequest,
    } = req.body;

    // required fields check
    if (
      !table_id ||
      !guests ||
      !reservation_date ||
      !reservation_time ||
      !specailRequest
    ) {
      return res.status(400).json({ message: "All field required" });
    }

    // reservation exists check
    const existsId = await sequelize.query(
      `SELECT id FROM reservations WHERE id=? AND user_id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id, userId],
      }
    );
    if (existsId.length === 0) {
      return res.status(400).json({ message: "Reservation id not found!" });
    }

    // table check
    const tableStatus = await sequelize.query(
      `SELECT id, tableStatus, seats FROM tables WHERE id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [table_id],
      }
    );
    const table = (tableStatus as any)[0];
    if (table.tableStatus === "unavailable") {
      return res
        .status(400)
        .json({ message: "Sorry, this table is unavailable" });
    }

    // guest capacity check
    if (guests > table.seats) {
      return res.status(400).json({
        message: `Sorry, this table can accommodate only ${table.seats} guests`,
      });
    }

    // already booked check
    const existingReservation = await sequelize.query(
      `SELECT id FROM reservations 
      WHERE table_id = ?
      AND reservation_date = ?
      AND status IN ('pending','booking')
      AND reservation_time < ADDTIME(?, '01:00:00')
      AND ADDTIME(reservation_time, '01:00:00') > ?
      AND id != ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [
          table_id,
          reservation_date,
          reservation_time,
          reservation_time,
          id,
        ],
      }
    );

    if (reservation_time < "10:00:00" || reservation_time >= "20:00:00") {
      return res.status(400).json({
        message: "Reservation time must be between 10:00 AM and 08:00 PM",
      });
    }

    if (existingReservation.length > 0) {
      return res.status(400).json({
        message: "Sorry, this table is already booked for that date & time",
      });
    }

    // update query (without status)
    await sequelize.query(
      `UPDATE reservations  
     SET table_id=?, guests=?, reservation_date=?, reservation_time=?, specailRequest=?, updatedAt=NOW() 
     WHERE id=? AND user_id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [
          table_id,
          guests,
          reservation_date,
          reservation_time,
          specailRequest,
          id,
          userId,
        ],
      }
    );

    res.status(200).json({ message: "Update successfully!" });
  }
}

export default ReservationTable;
