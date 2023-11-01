import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DefaultPagination } from 'src/users/dto/users-pagination';

const postSortByValidation = (value: any): string => {
  const fields = ['id', 'title', 'content'];
  if (!value || typeof value !== 'string') return 'created_at';
  if (fields.includes(value.toLowerCase())) return value.toLowerCase();

  switch (value.toLowerCase()) {
    case 'shortdescription':
      return 'short_description';
      break;
    case 'blogid':
      return 'blog_id';
      break;
    case 'blogname':
      return 'blog_name';
      break;
    default:
      return 'created_at';
  }
};

export class PostsPagination extends DefaultPagination {
  @Transform(({ value }) => postSortByValidation(value))
  @IsOptional()
  sortBy: string = 'created_at';
}
