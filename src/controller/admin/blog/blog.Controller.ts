import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/types/type";
import { Response } from "express";
import { UpdatedAt } from "sequelize-typescript";

class Blog {
  static async createBlog(req: IExtendedRequest, res: Response) {
    const { blogTitle, blogDescription, blogCategory } = req.body;
    if (!blogTitle || !blogDescription || !blogCategory)
      return res.status(400).json({ message: "All field required" });
    const blogImage = req.file ? req.file.path : null;
    await sequelize.query(
      `INSERT INTO blog(blogTitle, blogDescription,blogImage, blogCategory,createdAt,updatedAt)VALUES(?,?,?,?,NOW(),NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: [blogTitle, blogDescription, blogImage, blogCategory],
      }
    );
    res.status(200).json({ message: "Blog Added succefully!" });
  }

  // get all blog
  static async allBlogList(req: IExtendedRequest, res: Response) {
    const allBlog = await sequelize.query(
      `SELECT * FROM blog ORDER BY id DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({ message: "Fetch All blog", data: allBlog });
  }

  // delete
  static async blogDelete(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exists = await sequelize.query(`SELECT id FROM blog WHERE id =?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (exists.length === 0)
      return res.status(404).json({ message: "Blog id not found!" });

    await sequelize.query(`DELETE FROM blog WHERE id = ?`, {
      type: QueryTypes.DELETE,
      replacements: [id],
    });
    res.status(200).json({ message: "blog delete successfully!" });
  }

  // single
  static async singleBlog(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exists: any = await sequelize.query(
      `SELECT * FROM blog WHERE id =?`,
      {
        type: QueryTypes.SELECT,
        replacements: [id],
      }
    );
    if (exists.length === 0) {
      return res.status(404).json({ message: "Blog id not found!" });
    } else {
      res.status(200).json({ message: "Single blog fetch", data: exists });
    }
  }

  // update

  static async updateBlog(req: IExtendedRequest, res: Response) {
    const { id } = req.params;
    const exists = await sequelize.query(`SELECT * FROM blog WHERE id =?`, {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (exists.length === 0)
      return res.status(404).json({ message: "Blog id not found!" });
    const { blogTitle, blogDescription, blogCategory } = req.body;
    if (!blogTitle || !blogDescription)
      return res.status(400).json({ message: "All field required" });
    const blogImage = req.file ? req.file.path : null;

    // update
    await sequelize.query(
      `UPDATE blog SET blogTitle=?,blogDescription=?,blogImage=?,blogCategory=?,updatedAt=NOW() WHERE id =?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [blogTitle, blogDescription, blogImage, blogCategory, id],
      }
    );
    res.status(200).json({ message: "Update successfuly!" });
  }
}
export default Blog;
