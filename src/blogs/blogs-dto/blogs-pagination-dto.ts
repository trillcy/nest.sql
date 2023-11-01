import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DefaultPagination } from 'src/users/dto/users-pagination';

const blogSortByValidation = (value: any): string => {
  const fields = ['id', 'name', 'description'];
  if (!value || typeof value !== 'string') return 'created_at';
  if (fields.includes(value.toLowerCase())) return value.toLowerCase();

  switch (value.toLowerCase()) {
    case 'websiteurl':
      return 'website_url';
      break;
    case 'ismembership':
      return 'is_membership';
      break;
    default:
      return 'created_at';
  }
};

const searchTermValidation = (value: any): string => {
  if (!value || typeof value !== 'string') {
    return '%%';
  } else {
    return `%${value}%`;
  }
};

export class BlogsPagination extends DefaultPagination {
  @Transform(({ value }) => searchTermValidation(value))
  @IsOptional()
  searchNameTerm: string = '%';
  @Transform(({ value }) => blogSortByValidation(value))
  @IsOptional()
  sortBy: string = 'created_at';
}
