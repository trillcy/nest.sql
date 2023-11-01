import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BlogIdDto {
  @IsNotEmpty()
  @IsUUID()
  blogId: string;
}
