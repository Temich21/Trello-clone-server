import { Test, TestingModule } from '@nestjs/testing';
import { BoardRepository } from './board.repository';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Board } from './entities/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BoardRepository', () => {
  let boardRepository: BoardRepository
  let boardRepo: Repository<Board>
  let dataSourceMock: Partial<DataSource>
  let entityManagerMock: Partial<EntityManager>

  beforeEach(async () => {
    entityManagerMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      }),
    }

    dataSourceMock = {
      transaction: jest.fn().mockImplementation((cb: (manager: EntityManager) => Promise<any>) => {
        return cb(entityManagerMock as EntityManager)
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardRepository,
        {
          provide: getRepositoryToken(Board),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    boardRepository = module.get<BoardRepository>(BoardRepository);
    boardRepo = module.get<Repository<Board>>(getRepositoryToken(Board));
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      const userId = 'user-id';
      const mockBoards = [
        {
          id: 'board1',
          name: 'Board 1',
          rank: 1,
          user: { id: userId },
        },
        {
          id: 'board2',
          name: 'Board 2',
          rank: 2,
          user: { id: userId },
        },
      ] as Board[];

      jest.spyOn(boardRepo, 'find').mockResolvedValue(mockBoards);

      const result = await boardRepository.findAll(userId);
      expect(result).toEqual(mockBoards);
    })
  });

  describe('changeRank', () => {
    it('should change the rank of the board and adjust other ranks', async () => {
      const boardDto = {
        id: 'board-id',
        name: 'Test Board',
        userId: 'user-id',
        rank: 2,
      };
      const mockBoard = {
        id: boardDto.id,
        user: { id: boardDto.userId },
        rank: 1,
      } as Board;

      (entityManagerMock.findOne as jest.Mock).mockResolvedValue(mockBoard);

      await boardRepository.changeRank(boardDto);

      expect(entityManagerMock.findOne).toHaveBeenCalledWith(Board, { where: { id: boardDto.id } });
      expect(entityManagerMock.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(entityManagerMock.save).toHaveBeenCalledWith(Board, { ...mockBoard, rank: boardDto.rank });
    });

    it('should throw NotFoundException if the board is not found', async () => {
      const boardDto = {
        id: 'board-id',
        userId: 'user-id',
        name: 'Test Board',
        rank: 2,
      };

      (entityManagerMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(boardRepository.changeRank(boardDto)).rejects.toThrow(NotFoundException);
    });

    it('should do nothing if the rank is the same', async () => {
      const boardDto = {
        id: 'board-id',
        userId: 'user-id',
        name: 'Test Board',
        rank: 1,
      };
      const mockBoard = {
        id: boardDto.id,
        user: { id: boardDto.userId },
        rank: 1,
      } as Board;

      (entityManagerMock.findOne as jest.Mock).mockResolvedValue(mockBoard);

      await boardRepository.changeRank(boardDto);

      expect(entityManagerMock.createQueryBuilder).not.toHaveBeenCalled();
      expect(entityManagerMock.save).not.toHaveBeenCalled();
    });
  });
});
