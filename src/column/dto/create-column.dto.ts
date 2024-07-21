import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateColumnDto {
    // constructor(readonly name: String, readonly boardId: String) { }

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    boardId: string
}
