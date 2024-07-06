export interface UserCredentials {
    name?: string
    email: string
    password: string
}

export interface User {
    id: string
    name: string
    email: string
}

export class UserDto {
    public id: string
    public name: string
    public email: string

    constructor(model: User) {
        this.id = model.id
        this.name = model.name
        this.email = model.email
    }
}