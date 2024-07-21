import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
    @IsString()
    @IsNotEmpty()
    id: string
}
