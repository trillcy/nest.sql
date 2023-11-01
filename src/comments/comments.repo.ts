import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsPaginationDto } from './comments-dto/comments-pagination-dto';

@Injectable()
export class CommentsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(newData: any[]) {
    const result = await this.dataSource.query(
      `INSERT INTO public."Comments"
      ("content", "user_id", "user_login", "created_at", "post_id")
      VALUES ($1,$2,$3,$4,$5) RETURNING "id","content", "user_id", "user_login", "created_at", "post_id", "created_at"`,
      newData,
    );

    if (result.length) {
      return {
        id: result[0].id,
        content: result[0].content,
        commentatorInfo: {
          userId: result[0].user_id,
          userLogin: result[0].user_login,
        },
        createdAt: result[0].created_at.toISOString(),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      };
    } else return null;
  }

  async findById(id: string) {
    const result = await this.dataSource.query(
      `SELECT id, content, user_id, user_login, created_at, post_id
      FROM public."Comments" WHERE "id" = $1`,
      [id],
    );

    if (result.length) {
      return {
        id: result[0].id,
        content: result[0].content,
        commentatorInfo: {
          userId: result[0].user_id,
          userLogin: result[0].user_login,
        },
        createdAt: result[0].created_at.toISOString(),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      };
    } else return null;
  }

  async findAllForPostWithLikes(
    postId: string,
    query: CommentsPaginationDto,
    userId?: string,
  ) {
    const items = await this.dataSource.query(
      `SELECT c.id, c.content, c.user_id, c.user_login, c.created_at,

        (select count(*) 
        from public."CommentLikes"
        where comment_id = c.id
        and "status" = 'Like')as "likesCount",

        (select count(*) 
        from public."CommentLikes"
        where comment_id = c.id
        and "status" = 'Dislike') as "dislikesCount",

        (select status 
        from public."CommentLikes"
        where user_id = $4
        and comment_id = c.id) as "myStatus"

        FROM public."Comments" c 
        WHERE c.post_id = $1

      ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $2
      OFFSET $3
`,
      [postId, query.pageSize, query.skip(), userId || null],
    );

    let viewItems = items.map((i) => {
      return {
        id: i.id,
        content: i.content,
        postId: i.post_id,
        createdAt: i.created_at.toISOString(),
        commentatorInfo: {
          userId: i.user_id,
          userLogin: i.user_login,
        },
        likesInfo: {
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus ? i.myStatus : 'None',
        },
      };
    });

    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Comments" 
      WHERE "post_id" = $1
       `,
      [postId],
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

    // ----
    /*
    const items = await this.dataSource.query(
      `SELECT "id", "content", "user_id", "user_login", "created_at" 
      FROM public."Comments" 
      WHERE "post_id" = $1
      ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $2
      OFFSET $3
`,
      [postId, query.pageSize, query.skip()],
    );
    const viewItems = items.map((i) => {
      return {
        id: i.id,
        content: i.content,
        commentatorInfo: { userId: i.user_id, userLogin: i.user_login },
        createdAt: i.created_at.toISOString(),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      };
    });
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Comments" 
      WHERE "post_id" = $1
       `,
      [postId],
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
    */
  }

  async findAllForPost(postId: string, query: CommentsPaginationDto) {
    const items = await this.dataSource.query(
      `SELECT "id", "content", "user_id", "user_login", "created_at" 
      FROM public."Comments" 
      WHERE "post_id" = $1
      ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $2
      OFFSET $3
`,
      [postId, query.pageSize, query.skip()],
    );
    const viewItems = items.map((i) => {
      return {
        id: i.id,
        content: i.content,
        commentatorInfo: { userId: i.user_id, userLogin: i.user_login },
        createdAt: i.created_at.toISOString(),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      };
    });
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Comments" 
      WHERE "post_id" = $1
       `,
      [postId],
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

  async updateComment(data: any[]) {
    return await this.dataSource.query(
      `UPDATE public."Comments"
      SET content=$2
      WHERE "id" = $1 
      --RETURNING "id"
      `,
      data,
    );
  }

  async deleteCommentById(commentId: string) {
    return await this.dataSource.query(
      `DELETE FROM public."Comments" WHERE "id" = $1`,
      [commentId],
    );
  }

  async deleteCommentsForPosts(postIds: string[]) {
    return await this.dataSource.query(
      `DELETE FROM public."Comments" WHERE "post_id" IN $1`,
      [postIds],
    );
  }

  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."Comments"`);
  }
}
