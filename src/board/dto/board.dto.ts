import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class BoardDto {
    @IsString()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    userId: string

    // PR viz
    constructor(id: string, name: string, userId: string) {
        this.id = id
        this.name = name
        this.userId = userId
    }
}
