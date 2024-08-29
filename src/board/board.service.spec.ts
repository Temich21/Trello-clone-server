import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BoardService', () => {
  let service: BoardService
  let boardRepository: jest.Mocked<Repository<Board>>
  let dataSource: jest.Mocked<DataSource>

  const mockBoardRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
  })

  const mockDataSource = () => ({
    transaction: jest.fn(),
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(Board),
          useFactory: mockBoardRepository,
        },
        {
          provide: DataSource,
          useFactory: mockDataSource,
        },
      ],
    }).compile()

    service = module.get<BoardService>(BoardService)
    boardRepository = module.get(getRepositoryToken(Board))
    dataSource = module.get(DataSource)
  })

  describe('changeRank', () => {
    it('should throw NotFoundException if board is not found', async () => {
      //менеджер возвращает null
      await expect(
        service.changeRank({ id: '1', name: 'Test Board', rank: 2, userId: '1' }),
      ).rejects.toThrow(NotFoundException)

      expect(dataSource.transaction).toHaveBeenCalled()
    })

    it('should not update if the rank is the same', async () => {
      const mockBoard = { id: '1', name: 'Test Board', rank: 2, userId: '1' };

      dataSource.transaction.mockImplementation(async (fn) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue(mockBoard),
          save: jest.fn(),
          createQueryBuilder: jest.fn().mockReturnThis(),
        } as unknown as EntityManager;

        await fn(manager)

        expect(manager.save).not.toHaveBeenCalled();
      });

      await service.changeRank({ id: '1', name: 'Test Board', rank: 2, userId: '1' });
    });

    it('should update ranks correctly when increasing the rank', async () => {
      const mockBoard = { id: '1', rank: 1, userId: '1' };

      dataSource.transaction.mockImplementation(async (fn) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue(mockBoard),
          createQueryBuilder: jest.fn().mockReturnValue({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            execute: jest.fn(),
          }),
          save: jest.fn(),
        } as unknown as EntityManager;

        await fn(manager);

        expect(manager.createQueryBuilder().update).toHaveBeenCalledWith(Board);
        expect(manager.createQueryBuilder().set).toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledWith({ ...mockBoard, rank: 2 });
      });

      await service.changeRank({ id: '1', name: 'Test Board', rank: 2, userId: '1' });
    });

    it('should update ranks correctly when decreasing the rank', async () => {
      const mockBoard = { id: '1', rank: 3, userId: '1' };

      dataSource.transaction.mockImplementation(async (fn) => {
        const manager = {
          findOne: jest.fn().mockResolvedValue(mockBoard),
          createQueryBuilder: jest.fn().mockReturnValue({
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            execute: jest.fn(),
          }),
          save: jest.fn(),
        } as unknown as EntityManager;

        await fn(manager);

        expect(manager.createQueryBuilder().update).toHaveBeenCalledWith(Board);
        expect(manager.createQueryBuilder().set).toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledWith({ ...mockBoard, rank: 2 });
      });

      await service.changeRank({ id: '1', name: 'Test Board', rank: 2, userId: '1' });
    });
  })

});
