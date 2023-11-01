import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostsPagination } from './posts-dto/posts-pagination-dto';

@Injectable()
export class PostsRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async updatePostForBlog(data: any[]) {
    return await this.dataSource.query(
      `UPDATE public."Posts"
      SET blog_name=$2
      WHERE "blog_id" = $1
      `,
      data,
    );
  }

  async updatePost(data: any[]) {
    return await this.dataSource.query(
      `UPDATE public."Posts"
      SET title=$3, short_description=$4, content=$5
      WHERE "id" = $2 AND "blog_id" = $1
      --RETURNING "id"
      `,
      data,
    );
  }

  async createPost(newData: any[]) {
    const result = await this.dataSource.query(
      `INSERT INTO public."Posts"
      ("title", "short_description", "content", "blog_id", "blog_name", "created_at")
      VALUES ($1,$2,$3,$4,$5, $6) RETURNING "id","title", "short_description", "content", "blog_id", "blog_name", "created_at"`,
      newData,
    );
    if (result.length) {
      return {
        id: result[0].id,
        title: result[0].title,
        shortDescription: result[0].short_description,
        content: result[0].content,
        blogId: result[0].blog_id,
        blogName: result[0].blog_name,
        createdAt: result[0].created_at.toISOString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    } else return null;
  }

  async findById(id: string) {
    const result = await this.dataSource.query(
      `SELECT p.id, p.title, p.short_description, p.content, p.blog_id, p.blog_name, p.created_at
    	FROM public."Posts" p 
      WHERE p."id" = $1

      ORDER BY p.created_at`,
      [id],
    );
    return result.length ? result[0] : null;
  }

  async findByIdWithLikes(id: string, userId?: string) {
    const items = await this.dataSource.query(
      `SELECT p.id, p.title, p.short_description,
      p.content, p.blog_id, p.created_at, 
      p.blog_name,

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Like') as "likesCount",

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Dislike') as "dislikesCount",

        (select status 
        from public."PostLikes"
        where user_id = $2
        and post_id = p.id) as "myStatus",

        (select array(select row_to_json(row) from (select user_id as "userId", user_login as "login", created_at as "addedAt"
        from public."PostLikes"
        where status = 'Like'
        and post_id = p.id
        order by created_at desc
        limit 3
        offset 0) as row) ) as "newestLikes"

        FROM public."Posts" p 
        WHERE "id" = $1

      ORDER BY p.created_at DESC 
      LIMIT 10
      OFFSET 0
`,
      [id, userId || null],
    );

    return (
      items.map((i) => {
        return {
          id: i.id,
          title: i.title,
          shortDescription: i.short_description,
          content: i.content,
          blogId: i.blog_id,
          blogName: i.blog_name,
          createdAt: i.created_at.toISOString(),
          extendedLikesInfo: {
            likesCount: +i.likesCount,
            dislikesCount: +i.dislikesCount,
            myStatus: i.myStatus ? i.myStatus : 'None',
            newestLikes: i.newestLikes,
          },
        };
      })[0] ?? null
    );
  }

  async findAllForBlogWithLikes(
    blogId: string,
    query: PostsPagination,
    userId?: string,
  ) {
    const items = await this.dataSource.query(
      `SELECT p.id, p.title, p.short_description,
      p.content, p.blog_id, p.created_at, 
      p.blog_name,

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Like')as "likesCount",

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Dislike')as "dislikesCount",

        (select status 
        from public."PostLikes"
        where user_id = $4
        and post_id = p.id) as "myStatus",

        (select array(select row_to_json(row) from (select user_id as "userId", user_login as "login", created_at as "addedAt"
        from public."PostLikes"
        where status = 'Like'
        and post_id = p.id
        order by created_at desc
        limit 3
        offset 0) as row) ) as "newestLikes"

        FROM public."Posts" p 
        WHERE "blog_id" = $1      
        ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $2
      OFFSET $3
`,
      [blogId, query.pageSize, query.skip(), userId || null],
    );

    let viewItems = items.map((i) => {
      return {
        id: i.id,
        title: i.title,
        shortDescription: i.short_description,
        content: i.content,
        blogId: i.blog_id,
        blogName: i.blog_name,
        createdAt: i.created_at.toISOString(),
        extendedLikesInfo: {
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus ? i.myStatus : 'None',
          newestLikes: i.newestLikes,
        },
      };
    });
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Posts" 
      WHERE "blog_id" = $1
       `,
      [blogId],
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

  async findAllForBlog(blogId: string) {
    return await this.dataSource.query(
      `SELECT p.id, p.title, p.short_description, p.content, p.blog_id, p.blog_name, p.created_at,
      FROM public."Posts" p
      WHERE p."blog_id" = $1
`,
      [blogId],
    );
  }

  async findAllWithLikes(query: PostsPagination, userId?: string | null) {
    const items = await this.dataSource.query(
      `SELECT p.id, p.title, p.short_description, p.content, p.blog_id, p.created_at, p.blog_name,

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Like')as "likesCount",

        (select count(*) 
        from public."PostLikes"
        where post_id = p.id
        and "status" = 'Dislike')as "dislikesCount",

        (select status 
        from public."PostLikes"
        where user_id = $3
        and post_id = p.id) as "myStatus",

        (select array(select row_to_json(row) from (select user_id as "userId", user_login as "login", created_at as "addedAt"
        from public."PostLikes"
        where status = 'Like'
        and post_id = p.id
        order by created_at desc
        limit 3
        offset 0) as row) ) as "newestLikes"

        FROM public."Posts" p 

        ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $1
      OFFSET $2
`,
      [query.pageSize, query.skip(), userId || null],
    );
    let viewItems = items.map((i) => {
      return {
        id: i.id,
        title: i.title,
        shortDescription: i.short_description,
        content: i.content,
        blogId: i.blog_id,
        blogName: i.blog_name,
        createdAt: i.created_at.toISOString(),
        extendedLikesInfo: {
          likesCount: +i.likesCount,
          dislikesCount: +i.dislikesCount,
          myStatus: i.myStatus ? i.myStatus : 'None',
          newestLikes: i.newestLikes,
        },
      };
    });

    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Posts" 
       `,
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

  async deletePostsForBlogs(blogIds: string[]) {
    return await this.dataSource.query(
      `DELETE FROM public."Posts" WHERE "blog_id" IN $1`,
      [blogIds],
    );
  }

  async deletePostById(postId: string) {
    return await this.dataSource.query(
      `DELETE FROM public."Posts" WHERE "id" = $1`,
      [postId],
    );
  }
  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."Posts"`);
  }
}
