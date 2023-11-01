import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  Max,
  Validate,
} from 'class-validator';
import { IsTrim } from 'src/infrastructure/validators/is-trim';

export class CreatePostDto {
  @IsString()
  @Validate(IsTrim)
  @Length(1, 30)
  title: string;
  @IsString()
  @Validate(IsTrim)
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Validate(IsTrim)
  @Length(1, 1000)
  content: string;
}
