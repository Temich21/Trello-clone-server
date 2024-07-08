import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from 'src/auth/token/token.entity';
import { Board } from 'src/board/entities/board.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 40 })
    name: string

    @Column({ type: 'varchar', length: 40 })
    email: string

    @Column({ type: 'text' })
    password: string

    @OneToMany(() => Token, token => token.user)
    tokens: Token[]

    @OneToMany(() => Board, board => board.user)
    boards: Board[]

    constructor(name: string, email: string, hashPassword: string) {
        this.name = name
        this.email = email
        this.password = hashPassword
    }
}