import { Column as ColumnORM, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Column {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ColumnORM({ type: 'varchar', length: 40 })
    name: string

    @ManyToOne(() => Board, board => board.columns, { onDelete: 'CASCADE' })
    board: Board

    @OneToMany(() => Card, card => card.column)
    cards: Card[]

    @ColumnORM({ type: 'bigint' })
    rank: number
}