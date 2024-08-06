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
    return await this.boardService.create(boardDto)
  }

  @Get('all/:userId')
  async findAll(
    @Param('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
    @Next() next: NextFunction
  ) {
    const boards = await this.boardService.findAll(userId)
    return boards
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

  @Patch('rank')
  async changeRank(
    @Body() boardDto: BoardDto
  ) {
    await this.boardService.changeRank(boardDto)
    return boardDto
  }

  @Delete()
  async remove(
    @Body() boardDto: BoardDto
  ) {
    await this.boardService.remove(boardDto)
    return boardDto
  }
}
