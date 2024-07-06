import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from 'src/auth/token/token.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 40 })
    name: string

    @Column({ type: 'varchar', length: 40 })
    email: string

    @Column({ type: 'text' })
    password: string

    @OneToMany(() => Token, token => token.user)
    tokens: Token[]

    constructor(name: string, email: string, hashPassword: string) {
        this.name = name
        this.email = email
        this.password = hashPassword
    }
}