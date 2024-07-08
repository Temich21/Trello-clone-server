import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Next, Res } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { NextFunction } from 'express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Res({ passthrough: true }) res: Response,
    @Next() next: NextFunction
  ) {
    try {
      return await this.boardService.create(createBoardDto)
    } catch (e) {
      return next(new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Error during Creating Board',
      }, HttpStatus.FORBIDDEN, {
        cause: e
      }))
    }
  }

  @Get('all/:userId')
  async findAll(
    @Param('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
    @Next() next: NextFunction
  ) {
    try {
      const boards = await this.boardService.findAll(userId)
      return boards
    } catch (e) {
      return next(new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Error during Getting All Boards',
      }, HttpStatus.FORBIDDEN, {
        cause: e
      }))
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return await this.boardService.findOne(id) // if board is null???
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto
  ) {
    await this.boardService.update(id, updateBoardDto)
    return { id, ...updateBoardDto }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.boardService.remove(id)
    return id
  }
}
