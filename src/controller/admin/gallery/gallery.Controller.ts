import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { getIO } from "../../../../server";
class Gallery {
  static async uploadImage(req: IExtendedRequest, res: Response) {
    const { address } = req.body;
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "No image upload" });
    }
    const files = req.files as Express.Multer.File[];
    const values = files.map((file) => [address, file.path]);
    await sequelize.query(
      `INSERT INTO gallery (address, image, createdAt, updatedAt) VALUES ${values
        .map(() => `(?, ?, NOW(), NOW())`)
        .join(",")}`,
      {
        replacements: values.flat(),
        type: QueryTypes.INSERT,
      }
    );
    const io = getIO();
    files.forEach((file) => {
      io.emit("galleryAdded", { address, image: file.path });
    });
    res.status(200).json({ message: "Upload Image" });
  }
  // get all
  static async getAllImage(req: IExtendedRequest, res: Response) {
    const imageData = await sequelize.query(
      `SELECT * FROM gallery  ORDER BY createdAt DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({ message: "Fetch All image", data: imageData });
  }
  // delete image
  static async deleteImage(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exitsId = await sequelize.query(
      `SELECT id FROM gallery WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (!exitsId || exitsId.length === 0) {
      return res.status(400).json({ message: "Image id not found" });
    }

    const [deletedImage]: any = await sequelize.query(
      `DELETE FROM gallery WHERE id=?`,
      {
        type: QueryTypes.DELETE,
        replacements: [id],
      }
    );
    getIO().emit("galleryDeleted", deletedImage);
    res.status(200).json({ message: "Image deleted successfully" });
  }
  // update
  static async updateImage(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const { address } = req.body;
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "No image upload" });
    }
    const files = req.files as Express.Multer.File[];
    const file = files[0];
    const exitsId = await sequelize.query(
      `SELECT id FROM gallery WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (!exitsId || exitsId.length === 0) {
      return res.status(400).json({ message: "Image id not found" });
    }
    await sequelize.query(
      `UPDATE gallery SET address = ?, image = ?, updatedAt = NOW() WHERE id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [address, file.path, id],
      }
    );
    getIO().emit("galleryUpdated", { id, address, image: file.path });
    return res.status(200).json({ message: "Image updated successful" });
  }
  // single
  static async singleImage(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exitsId = await sequelize.query(
      `SELECT id FROM gallery WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (!exitsId || exitsId.length === 0) {
      return res.status(400).json({ message: "Image id not found" });
    }
    const ImageData = await sequelize.query(
      `SELECT * FROM gallery WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    res.status(200).json({ message: "single image fetch!", data: ImageData });
  }
}
export default Gallery;
