import { Column as ColumnORM, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Column } from '../../column/entities/column.entity';

@Entity()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ColumnORM({ type: 'varchar', length: 40 })
    name: string

    @ManyToOne(() => User, user => user.boards, { onDelete: 'CASCADE' })
    user: User

    @OneToMany(() => Column, column => column.board)
    columns: Column[]

    @ColumnORM({ type: 'bigint' })
    rank: number
}