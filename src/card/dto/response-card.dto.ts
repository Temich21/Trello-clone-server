import { CreateCardDto } from './create-card.dto';
import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ResponseCardDto extends PartialType(CreateCardDto) {
    @IsString()
    @IsNotEmpty()
    id: string;

    constructor(id: string, name: string, columnId: string) {
        super()
        this.id = id
        this.name = name
        this.columnId = columnId
    }
}