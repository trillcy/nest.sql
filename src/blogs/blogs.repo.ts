import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogsPagination } from './blogs-dto/blogs-pagination-dto';

@Injectable()
export class BlogsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async updateBlog(data: any[]) {
    return await this.dataSource.query(
      `UPDATE public."Blogs"
      SET name=$2, description=$3, website_url=$4
      WHERE "id" = $1 
      --RETURNING "id"
      `,
      data,
    );
  }

  async createBlog(newData: any[]) {
    const result = await this.dataSource.query(
      `INSERT INTO public."Blogs"
      ("name", "description", "website_url", "created_at", "is_membership")
      VALUES ($1,$2,$3,$4,$5) RETURNING "id", "name", "description", "website_url", "created_at", "is_membership"`,
      newData,
    );
    if (result.length) {
      return {
        id: result[0].id,
        name: result[0].name,
        description: result[0].description,
        websiteUrl: result[0].website_url,
        createdAt: result[0].created_at.toISOString(),
        isMembership: result[0].is_membership,
      };
    } else return null;
  }

  async findById(id: string) {
    const result = await this.dataSource.query(
      `SELECT "id", "name", "description", "website_url", "created_at", "is_membership"
    FROM public."Blogs" WHERE "id" = $1`,
      [id],
    );

    if (result.length) {
      return {
        id: result[0].id,
        name: result[0].name,
        description: result[0].description,
        websiteUrl: result[0].website_url,
        createdAt: result[0].created_at.toISOString(),
        isMembership: result[0].is_membership,
      };
    } else return null;
  }

  async findAll(query: BlogsPagination) {
    const items = await this.dataSource.query(
      `SELECT "id", "name", "description", "website_url", "created_at", "is_membership"
      FROM public."Blogs" 
      WHERE "name" ILIKE $1 
      ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $2
      OFFSET $3
`,
      [query.searchNameTerm, query.pageSize, query.skip()],
    );
    const viewItems = items.map((i) => {
      return {
        id: i.id,
        name: i.name,
        description: i.description,
        websiteUrl: i.website_url,
        createdAt: i.created_at.toISOString(),
        isMembership: i.is_membership,
      };
    });
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Blogs" 
      WHERE "name" ILIKE $1 
       `,
      [query.searchNameTerm],
    );

    const pagesCount =
      +totalCount[0].count % +query.pageSize
        ? Math.floor(+totalCount[0].count / +query.pageSize) + 1
        : Math.floor(+totalCount[0].count / +query.pageSize);
    return {
      pagesCount,
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: viewItems,
    };
  }
  async deleteBlog(blogId: string) {
    return await this.dataSource.query(
      `DELETE FROM public."Blogs" WHERE "id" = $1`,
      [blogId],
    );
  }
  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."Blogs"`);
  }
}
