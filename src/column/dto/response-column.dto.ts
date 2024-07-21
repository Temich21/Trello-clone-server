import { CreateColumnDto } from './create-column.dto';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ResponseColumnDto extends CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    id: string
}
