import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Max,
  Validate,
} from 'class-validator';
import { IsTrim } from 'src/infrastructure/validators/is-trim';

export class CreateBlogDto {
  @IsString()
  @Validate(IsTrim)
  @Length(1, 15)
  name: string;
  @IsString()
  @Validate(IsTrim)
  @Length(1, 500)
  description: string;
  @Validate(IsTrim)
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
