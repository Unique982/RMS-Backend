import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { getIO } from "../../../../server";
class Gallery {
  static async uploadImage(req: IExtendedRequest, res: Response) {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const files = req.files as Express.Multer.File[];
    const values = files.map((file) => [file.path]);
    await sequelize.query(
      `INSERT INTO gallery (image, createdAt, updatedAt) VALUES ${values
        .map(() => `( ?, NOW(), NOW())`)
        .join(",")}`,
      {
        replacements: values.flat(),
        type: QueryTypes.INSERT,
      }
    );
    const io = getIO();
    files.forEach((file) => {
      io.emit("galleryAdded", { image: file.path });
    });
    res.status(200).json({ message: "Images uploaded successfully" });
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

    const existsId = await sequelize.query(
      `SELECT id FROM gallery WHERE id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );

    if (!existsId || existsId.length === 0) {
      return res.status(400).json({ message: "Image id not found" });
    }

    await sequelize.query(`DELETE FROM gallery WHERE id = ?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });

    getIO().emit("galleryDeleted", { id });

    res
      .status(200)
      .json({ message: "Image deleted successfully", success: true });
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
