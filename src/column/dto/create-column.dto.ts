import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    boardId: string
}
