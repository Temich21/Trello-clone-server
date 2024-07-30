import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Next, Res, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { NextFunction } from 'express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  async create(
    @Body() boardDto: BoardDto,
    @Res({ passthrough: true }) res: Response,
    @Next() next: NextFunction
  ) {
    try {
      return await this.boardService.create(boardDto)
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
    return await this.boardService.findOne(id)
  }

  @Patch()
  async update(
    @Body() boardDto: BoardDto
  ) {
    await this.boardService.update(boardDto)
    return boardDto
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.boardService.remove(id)
    return id
  }
}
