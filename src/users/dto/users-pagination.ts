import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const userSortByValidation = (value: any): string => {
  const fields = ['id', 'login', 'email'];
  if (!value || typeof value !== 'string') return 'created_at';
  if (fields.includes(value.toLowerCase())) return value.toLowerCase();
  return 'created_at';
};

const sortDirectionValidation = (value: any): 'ASC' | 'DESC' => {
  if (!value || typeof value !== 'string') return 'DESC';
  return value.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
};

const searchTermValidation = (value: any): string => {
  if (!value || typeof value !== 'string') {
    return '%%';
  } else {
    return `%${value}%`;
  }
};

export class DefaultPagination {
  @IsOptional()
  pageNumber: number = 1;
  @IsOptional()
  pageSize: number = 10;
  @Transform(({ value }) => sortDirectionValidation(value))
  @IsOptional()
  sortDirection: string = 'DESC';
  @IsOptional()
  skip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export class UsersPagination extends DefaultPagination {
  @Transform(({ value }) => searchTermValidation(value))
  @IsOptional()
  searchLoginTerm: string = '%';
  @Transform(({ value }) => searchTermValidation(value))
  @IsOptional()
  searchEmailTerm: string = '%';
  @Transform(({ value }) => userSortByValidation(value))
  @IsOptional()
  sortBy: string = 'created_at';
}
