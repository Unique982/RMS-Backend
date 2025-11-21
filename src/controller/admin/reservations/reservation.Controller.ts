import { Request, Response } from "express";
import { IExtendedRequest } from "../../../middleware/types/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import { getIO } from "../../../../server";

const convertTo24Hour = (time12: string) => {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
};
class ReservationBooking {
  // create Reservation
  static async createReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id || null;
    const {
      user_id,
      table_id,
      guests,
      reservation_date,
      reservation_time,
      specailRequest,
      status,
      name,
      phoneNumber,
    } = req.body;

    //
    if (
      !table_id ||
      !guests ||
      !reservation_date ||
      !reservation_time ||
      !specailRequest
    )
      return res.status(400).json({ message: "All field required" });

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
    const existingPhone = await sequelize.query(
      `SELECT id FROM reservations 
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

    const time24 = convertTo24Hour(reservation_time);
    // user select garay ko tyo date ma kunai user la table booked garay ko xa ki nai

    const existingReservation = await sequelize.query(
      `SELECT id FROM reservations WHERE table_id = ?
   AND reservation_date = ?
   AND status IN ('pending','booking')
   AND reservation_time < ADDTIME(?, '01:00:00')
   AND ADDTIME(reservation_time, '01:00:00') > ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [table_id, reservation_date, time24, time24],
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

    const [result]: any = await sequelize.query(
      `INSERT INTO reservations(user_id,table_id,guests,reservation_date,reservation_time,status,specailRequest,createdAt,updatedAt,name,phoneNumber)VALUES(?,?,?,?,?,?,?,NOW(),NOW(),?,?)`,
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
    getIO().emit("reservationAdded", {
      id: result,
      userId,
      table_id,
      guests,
      reservation_date,
      reservation_time,
      status,
      specailRequest,
      name,
      phoneNumber,
    });
    res.status(200).json({ message: "Reservation Booking successfully!" });
  }
  // get Reservation

  static async getReservation(req: IExtendedRequest, res: Response) {
    const userId = req.user?.id;
    const reservationData: any = await sequelize.query(
      `SELECT r.*, u.username, t.tableNumber
FROM reservations r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN tables t ON r.table_id = t.id
ORDER BY r.createdAt DESC`,
      { type: QueryTypes.SELECT }
    );

    res
      .status(200)
      .json({ message: "Fetch all reservations", data: reservationData });
  }

  // delete Reservation
  static async deleteReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;

    const existsId = await sequelize.query(
      `SELECT id FROM reservations WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsId.length === 0)
      return res.status(200).json({ message: "reservations id not found!" });

    await sequelize.query(`DELETE FROM reservations WHERE id =?`, {
      type: QueryTypes.DELETE,

      replacements: [id],
    });
    getIO().emit("reservationDeleted", { id });
    res.status(200).json({ message: "Reservation delete successfully!" });
  }
  // single Reservation
  static async singleReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const existsId = await sequelize.query(
      `SELECT *  FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsId.length === 0) {
      return res.status(400).json({ message: "Reservation id not found!" });
    } else {
      res
        .status(200)
        .json({ message: "single reservation fetch!", data: existsId });
    }
  }
  // update Reservation
  static async updateReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const {
      table_id,
      guests,
      reservation_date,
      reservation_time,
      specailRequest,
      status,
      name,
      phoneNumber,
    } = req.body;

    //
    if (
      !table_id ||
      !guests ||
      !reservation_date ||
      !reservation_time ||
      !specailRequest
    )
      return res.status(400).json({ message: "All field required" });

    const existsId = await sequelize.query(
      `SELECT id FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (existsId.length === 0)
      return res.status(400).json({ message: "Reservation id not found!" });
    const tableStatus = await sequelize.query(
      `SELECT id, tableStatus,seats FROM tables WHERE id != ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [table_id, id],
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
  AND ADDTIME(reservation_time, '01:00:00') > ? AND id!=? `,
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
    if (reservation_time < "10:00:00" || reservation_time >= "20:00:00")
      return res.status(400).json({
        message: "Reservation time must be between 10:00 AM  and 08:00 Pm",
      });

    if (existingReservation.length > 0)
      return res.status(400).json({
        message: "Sorry, this table is already booked for that date & time",
      });

    // update querty

    await sequelize.query(
      `UPDATE reservations  SET table_id=?,guests=?,reservation_date=?,reservation_time=?,status=?,specailRequest=?, name=?,phoneNumber=?,updatedAt=NOW() WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [
          table_id,
          guests,
          reservation_date,
          reservation_time,
          status,
          specailRequest,
          name,
          phoneNumber,
          id,
        ],
      }
    );
    getIO().emit("reservationUpdated", {
      id,
      table_id,
      guests,
      reservation_date,
      reservation_time,
      status,
      specailRequest,
    });
    res.status(200).json({ message: "Update successfully!" });
  }
  // soft delete Reservation
  static async softDeleteReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(
      `SELECT id FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (!idExists || idExists.length === 0)
      return res.status(400).json({ message: "Reservations id not found!" });

    // reservations
    await sequelize.query(
      `UPDATE reservations SET deleted_at=Now() WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [id],
      }
    );

    getIO().emit("orderDeleted", { order_id: id });

    res.status(200).json({ message: "Soft delete successfully!" });
  }
  // recover delete Reservation
  static async restoreDeleteReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(
      `SELECT id FROM reservations WHERE id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    await sequelize.query(
      `UPDATE reservations SET deleted_at=NULL WHERE id=?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [id],
      }
    );

    getIO().emit("orderAdded", { order_id: id });
    res.status(200).json({ message: "Reservations restore successfully!" });
  }
  // status update Reservation
  static async statusUpdateReservation(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Check if order exists
    const orderExists = await sequelize.query(
      `SELECT id, status FROM reservations WHERE id = ?`,
      { type: QueryTypes.SELECT, replacements: [id] }
    );

    if (!orderExists || orderExists.length === 0) {
      return res.status(404).json({ message: "Reservations Id not found" });
    }

    // Update only status
    await sequelize.query(
      `UPDATE reservations SET status = ?, updatedAt = NOW() WHERE id = ?`,
      { type: QueryTypes.UPDATE, replacements: [status, id] }
    );

    // socket update
    getIO().emit("reservationsUpdated", { order_id: id, status });

    return res
      .status(200)
      .json({ message: "Reservations status updated successfully" });
  }
}
export default ReservationBooking;
