import { Column as ColumnORM, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Column } from '../../column/entities/column.entity';

@Entity()
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ColumnORM({ type: 'varchar', length: 40 })
    name: string

    @ManyToOne(() => Column, column => column.cards, { onDelete: 'CASCADE' })
    column: Column

    @ColumnORM({ type: 'bigint' })
    rank: number
}