import { CreateBoardDto } from './create-board.dto';
import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ResponseBoardDto extends PartialType(CreateBoardDto) {
    @IsString()
    @IsNotEmpty()
    id: string

    constructor(id: string, name: string) {
        super()
        this.id = id
        this.name = name
    }
}