import { Injectable } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { BoardDto } from './dto/board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async create(boardDto: BoardDto): Promise<BoardDto> {
    const board = await this.boardRepository.create(boardDto)
    return new BoardDto(board.id, board.name, board.user.id)
  }

  async findAll(userId: string): Promise<Board[]> {
    return await this.boardRepository.findAll(userId)
  }

  async findOne(id: string): Promise<Board> {
    return await this.boardRepository.findOne(id)
  }

  async update(boardDto: BoardDto): Promise<void> {
    await this.boardRepository.update(boardDto)
  }

  async changeRank(boardDto: BoardDto): Promise<void> {
    await this.boardRepository.changeRank(boardDto)
  }

  async remove(id: string): Promise<void> {
    await this.boardRepository.remove(id)
  }
}
