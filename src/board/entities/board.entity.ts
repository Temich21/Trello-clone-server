import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 40 })
    name: string

    @ManyToOne(() => User, user => user.boards, { onDelete: 'CASCADE' })
    user: User
}
