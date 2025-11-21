import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";

class Service {
  static async addService(req: IExtendedRequest, res: Response) {
    const { serviceTitle, serviceDescription } = req.body;
    const serviceIcon = req.file ? req.file.path : null;

    if (!serviceTitle || !serviceDescription || !serviceIcon) {
      return res.status(400).json("All filed are required");
    }

    // check duplicate
    const exists = await sequelize.query(`SELECT * FROM service LIMIT 8 `, {
      type: QueryTypes.SELECT,
    });
    if (exists.length > 0) {
      return res.status(400).json("Already exists service");
    }
    // insert query
    await sequelize.query(
      `INSERT INTO service(serviceIcon,serviceTitle,serviceDescription,createdAt,updatedAt) VALUES(?,?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [serviceIcon, serviceTitle, serviceDescription],
      }
    );
    res.status(200).json({ message: "Added Successfully" });
  }

  // get all service
  static async getService(req: IExtendedRequest, res: Response) {
    const serviceData = await sequelize.query(`SELECT * FROM service`, {
      type: QueryTypes.SELECT,
    });
    res
      .status(200)
      .json({ message: "All service fetch data!", data: serviceData });
  }

  // delete
  static async deleteService(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exists = await sequelize.query(`SELECT id FROM service WHERE id =?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (exists.length === 0)
      return res.status(404).json({ message: "Service id not found!" });

    await sequelize.query(`DELETE FROM service WHERE id = ?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    res.status(200).json({ message: "Service delete successfully!" });
  }
  static async singleService(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exists = await sequelize.query(`SELECT id FROM service WHERE id =?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (exists.length === 0) {
      return res.status(404).json({ message: "Service id not found!" });
    }
    res
      .status(200)
      .json({ message: "Service delete successfully!", data: exists });
  }

  static async updateService(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { serviceTitle, serviceDescription } = req.body;
    const serviceIcon = req.file ? req.file.path : null;

    if (!serviceTitle || !serviceDescription) {
      return res.status(400).json("ID, Title, and Description are required");
    }

    const exists = await sequelize.query(`SELECT * FROM service WHERE id = ?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });

    if (exists.length === 0) {
      return res.status(404).json("Service not found");
    }

    // update query
    await sequelize.query(
      `UPDATE service 
     SET serviceTitle = ?, 
         serviceDescription = ?, 
         ${serviceIcon ? "serviceIcon = ?," : ""} 
         updatedAt = NOW() 
     WHERE id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: serviceIcon
          ? [serviceTitle, serviceDescription, serviceIcon, id]
          : [serviceTitle, serviceDescription, id],
      }
    );

    res.status(200).json({ message: "Updated Successfully" });
  }
}

export default Service;
