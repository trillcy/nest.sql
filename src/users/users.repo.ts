import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewDto } from './dto/user-view-dto';
import { NotFoundError } from 'rxjs';
import { UsersPagination } from './dto/users-pagination';

@Injectable()
export class UsersRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAll(query: UsersPagination) {
    const items = await this.dataSource.query(
      `SELECT "id", "login", "email", "created_at"
      FROM public."Users" 
      WHERE "login" ILIKE $1 OR "email" ILIKE $2 
      ORDER BY "${query.sortBy}" ${query.sortDirection} 
      LIMIT $3
      OFFSET $4
`,
      [
        query.searchLoginTerm,
        query.searchEmailTerm,
        query.pageSize,
        query.skip(),
      ],
    );
    const viewItems = items.map((i) => {
      return {
        id: i.id,
        login: i.login,
        email: i.email,
        createdAt: i.created_at.toISOString(),
      };
    });
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Users" 
      WHERE "login" ILIKE $1 OR "email" ILIKE $2 
       `,
      [query.searchLoginTerm, query.searchEmailTerm],
    );

    const pagesCount =
      +totalCount[0].count % +query.pageSize
        ? Math.floor(+totalCount[0].count / +query.pageSize) + 1
        : Math.floor(+totalCount[0].count / +query.pageSize);
    return {
      // offset: query.skip(),
      pagesCount,
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: +totalCount[0].count,
      items: viewItems,
    };
  }

  async findEmailData(email: string) {
    const result = await this.dataSource.query(
      `
    SELECT "id", "login", "email", "created_at", "email_confirmation_code", "email_expiration_date", "email_is_confirmed" FROM public."Users" WHERE "email" = $1`,
      [email],
    );
    if (result.length) {
      const user = {
        id: result[0].id,
        login: result[0].login,
        email: result[0].email,
        createdAt: result[0].created_at.toISOString(),
        emailConfirmationCode: result[0].email_confirmation_code,
        emailExpirationDate: result[0].email_expiration_date,
        emailIsConfirmed: result[0].email_is_confirmed,
      };
      return user;
    } else return null;
  }
  // from checkCredential
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<any> {
    const result = await this.dataSource.query(
      `SELECT "id", "login", "email", "created_at", "password_hash", "password_salt" FROM public."Users" WHERE "login" = $1 OR "email" = $1`,
      [loginOrEmail],
    );

    if (result.length) {
      const user = {
        id: result[0].id,
        login: result[0].login,
        email: result[0].email,
        createdAt: result[0].created_at.toISOString(),
        passwordHash: result[0].password_hash,
        passwordSalt: result[0].password_salt,
      };
      return user;
    } else return null;
  }

  async findByLogin(login: string) {
    const result = await this.dataSource.query(
      `SELECT "id", "login", "email", "created_at", "password_hash", "password_salt" 
    FROM public."Users" WHERE "login" = $1`,
      [login],
    );

    if (result.length) {
      return {
        id: result[0].id,
        login: result[0].login,
        email: result[0].email,
        createdAt: result[0].created_at.toISOString(),
      };
    } else return null;
  }

  async findByEmail(email: string) {
    const result = await this.dataSource.query(
      `SELECT "id", "login", "email", "created_at", "password_hash", "password_salt" 
    FROM public."Users" WHERE "email" = $1`,
      [email],
    );

    if (result.length) {
      return {
        id: result[0].id,
        login: result[0].login,
        email: result[0].email,
        createdAt: result[0].created_at.toISOString(),
      };
    } else {
      return null;
    }
  }

  async findProfileById(userId: string) {
    const result = await this.dataSource.query(
      `SELECT "id", "login", "email"
    FROM public."Users" WHERE "id" = $1`,
      [userId],
    );

    // if (!result.length) throw new NotFoundException();
    if (!result.length) return null;
    return {
      login: result[0].login,
      email: result[0].email,
      userId: result[0].id,
    };
  }
  /*
  async findAll(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string | null,
    sortDirection: string | null,
    pageNumber: number | null,
    pageSize: number | null,
  ) {
    // проверка на соответствие
    // TODO: как сделать большие или маленькие буквы???
    const checkedSortBy =
      sortBy &&
      ['id', 'login', 'email', 'createdat'].includes(sortBy.toLowerCase())
        ? sortBy
        : 'CreatedAt';
    const checkedSortDirection =
      sortDirection && ['asc', 'desc'].includes(sortDirection.toLowerCase())
        ? sortDirection
        : 'desc';

    const checkedPageNumber =
      pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
    const checkedPageSize =
      pageSize && Number.isInteger(pageSize) ? pageSize : 10;
    const offset = (checkedPageNumber - 1) * checkedPageSize;

    const items = await this.dataSource.query(
      `SELECT "Id", "Login", "Email", "CreatedAt"
      FROM public."Users" 
      WHERE "Login" ILIKE $1 OR "Email" ILIKE $2 
      ORDER BY "${checkedSortBy}" ${checkedSortDirection} 
      LIMIT $3
      OFFSET $4
`,
      [
        `%${searchLoginTerm ?? ''}%`,
        `%${searchEmailTerm ?? ''}%`,
        checkedPageSize,
        offset,
      ],
    );

    const totalCount = await this.dataSource.query(
      `SELECT COUNT(*) 
      FROM public."Users" 
      WHERE "Login" ILIKE $1 OR "Email" ILIKE $2 
       `,
      [`%${searchLoginTerm ?? ''}%`, `%${searchEmailTerm ?? ''}%`],
    );

    const pagesCount =
      +totalCount[0].count % +checkedPageSize
        ? Math.floor(+totalCount[0].count / +checkedPageSize) + 1
        : Math.floor(+totalCount[0].count / +checkedPageSize);
    return {
      pagesCount,
      page: checkedPageNumber,
      pageSize: checkedPageSize,
      totalCount: +totalCount[0].count,
      items,
    };
  }
*/
  async createUser(newData: any[]): Promise<string> {
    return await this.dataSource.query(
      `INSERT INTO public."Users"(
        "login", "email", "created_at", "password_hash", "password_salt", "email_confirmation_code", "email_expiration_date", "email_is_confirmed", "password_confirmation_code", "password_expiration_date", "password_is_confirmed")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
      newData,
    );
  }

  async deleteUser(id: string) {
    return await this.dataSource.query(
      `DELETE FROM public."Users" WHERE "id" = $1`,
      [id],
    );
  }

  async updateEmailData(newData: any[]) {
    return await this.dataSource.query(
      `
    UPDATE public."Users" 
    SET "email_confirmation_code" = $2, "email_expiration_date" = $3, "email_is_confirmed" = $4  
    WHERE "email" = $1 
    `,
      newData,
    );
  }
  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM public."Users"`);
  }
}
