import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ResponseCreateColumnDto extends PartialType(CreateColumnDto) {
    @IsString()
    @IsNotEmpty()
    id: string

    cards = []

    constructor(id: string, name: string) {
        super()
        this.id = id
        this.name = name
    }
}
