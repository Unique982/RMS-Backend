import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
class CustomerList {
  // All customer list here
  static async listCustomer(req: IExtendedRequest, res: Response) {
    const listCustomerData = await sequelize.query(
      `SELECT * FROM users WHERE role='customer'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res
      .status(200)
      .json({ message: "Fetch all Customer List", data: listCustomerData });
  }
  // single customer details
  static async singleDetailsCustomer(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(
      `SELECT * FROM users WHERE role='customer'AND id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (idExists.length === 0)
      return res.status(400).json({ message: "This id user not found!" });
    res
      .status(200)
      .json({ message: "Single Customer details", data: idExists });
  }
  // delete customer
  static async deleteCustomer(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const idExists = await sequelize.query(
      `SELECT id,role FROM users WHERE role='customer' AND id=?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (idExists.length === 0)
      return res.status(400).json({ message: "This id not found!" });

    await sequelize.query(`DELETE FROM users WHERE id =?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    res.status(200).json({ messag: "Customer delete successfuly!" });
  }
}
``;

export default CustomerList;
