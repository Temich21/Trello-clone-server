import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ColumnDto {
    @IsString()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    boardId: string

    @IsString()
    rank: number

    // PR viz
    constructor(id: string, name: string, boardId: string) {
        this.id = id
        this.name = name
        this.boardId = boardId
    }
}
