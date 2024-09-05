import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CardDto {
    @IsString()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    columnId: string

    @IsString()
    rank: number

    // PR viz
    constructor(id: string, name: string, columnId: string) {
        this.id = id
        this.name = name
        this.columnId = columnId
    }
}
