import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DefaultPagination } from 'src/users/dto/users-pagination';

const commentSortByValidation = (value: any): string => {
  const fields = ['id', 'content'];
  if (!value || typeof value !== 'string') return 'created_at';
  if (fields.includes(value.toLowerCase())) return value.toLowerCase();

  switch (value.toLowerCase()) {
    case 'userid':
      return 'user_id';
      break;
    case 'userlogin':
      return 'user_login';
      break;
    default:
      return 'created_at';
  }
};

export class CommentsPaginationDto extends DefaultPagination {
  @Transform(({ value }) => commentSortByValidation(value))
  @IsOptional()
  sortBy: string = 'created_at';
}
