import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentLikesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findMyStatus(data: any[]) {
    const result = await this.dataSource.query(
      `SELECT 
      "id", "status", "user_id", "user_login", "comment_id", "created_at"
      FROM public."CommentLikes"
      WHERE "comment_id" = $1 
      AND "user_id" = $2 `,
      data,
    );
    return result.length ? result[0] : null;
  }

  async updateMyStatus(updateData: any[]) {
    return await this.dataSource.query(
      `UPDATE public."CommentLikes"
      SET status = $2, created_at = $3
      WHERE id = $1 `,
      updateData,
    );
  }

  async createStatus(newData: any[]) {
    return await this.dataSource.query(
      `INSERT INTO public."CommentLikes"
      ("status", "user_id", "user_login", "post_id", "created_at")
      VALUES ($1,$2,$3,$4, $5) `,
      newData,
    );
  }

  async deleteMyStatus(id: string) {
    return await this.dataSource.query(
      `DELETE FROM public."CommentLikes" WHERE "id" = $1`,
      [id],
    );
  }

  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."CommentLikes"`);
  }
}
