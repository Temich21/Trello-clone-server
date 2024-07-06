import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
    user: User

    @Column({ type: 'text' })
    token: string

    @Column({ type: 'varchar', length: 255 })
    deviceIP: string
}
