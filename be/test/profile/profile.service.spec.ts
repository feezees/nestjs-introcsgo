import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../../src/profile/profile.service';
import { UsersService } from '../../src/users/users.service';
import { User, UserRole } from '../../src/users/user.entity';
import { UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

describe('ProfileService', () => {
  let service: ProfileService;
  let usersService: UsersService; // Будем мокать UsersService

  // Определяем мок-объект пользователя для использования в тестах
  const mockUser: User = {
    id: 1,
    nickname: 'testuser',
    passwordHash: 'hashedpassword',
    steamId: 12345,
    role: UserRole.USER,
    inventoryId: 1,
    inventory: {
      id: 1,
      itemIds: [],
      user: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          // Мокаем UsersService
          provide: UsersService,
          useValue: {
            isOwner: jest.fn(), // Мокаем метод isOwner
            findById: jest.fn(), // Мокаем метод findById
            update: jest.fn(), // Мокаем метод update для aiUpdateNickname
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    const testToken = 'someJwtToken';
    const testUserId = '1';

    it('should return a user profile if owner and user exists', async () => {
      // Настраиваем моки для успешного сценария
      (usersService.isOwner as jest.Mock).mockResolvedValue(true); // Пользователь является владельцем
      (usersService.findById as jest.Mock).mockResolvedValue(mockUser); // Пользователь найден

      const result = await service.getProfile(testToken, testUserId);
      expect(result).toEqual(mockUser);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(usersService.findById).toHaveBeenCalledWith(Number(testUserId));
    });

    it('should throw UnauthorizedException if not owner', async () => {
      // Настраиваем мок: пользователь НЕ является владельцем
      (usersService.isOwner as jest.Mock).mockResolvedValue(false);

      await expect(service.getProfile(testToken, testUserId)).rejects.toThrow(UnauthorizedException);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(usersService.findById).not.toHaveBeenCalled(); // findById не должен вызываться
    });

    it('should throw NotFoundException if user not found', async () => {
      // Настраиваем моки: пользователь является владельцем, но не найден
      (usersService.isOwner as jest.Mock).mockResolvedValue(true);
      (usersService.findById as jest.Mock).mockResolvedValue(null); // Пользователь не найден

      await expect(service.getProfile(testToken, testUserId)).rejects.toThrow(NotFoundException);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(usersService.findById).toHaveBeenCalledWith(Number(testUserId));
    });
  });

  describe('aiUpdateNickname', () => {
    const testToken = 'someJwtToken';
    const testUserId = '1';
    const oldNickname = 'oldNick';
    const newNickname = 'newNick';
    const mockAiResponse = { response: newNickname };

    // Мокаем глобальный fetch
    const mockFetch = jest.fn();
    beforeAll(() => {
      global.fetch = mockFetch;
    });
    afterAll(() => {
      delete global.fetch;
    });

    it('should update nickname if owner and AI returns a string', async () => {
      (usersService.isOwner as jest.Mock).mockResolvedValue(true);
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve(mockAiResponse),
      });
      (usersService.update as jest.Mock).mockResolvedValue({ ...mockUser, nickname: newNickname });

      const result = await service.aiUpdateNickname(testToken, testUserId, oldNickname);
      expect(result.nickname).toBe(newNickname);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(usersService.update).toHaveBeenCalledWith(Number(testUserId), { nickname: newNickname });
    });

    it('should throw UnauthorizedException if not owner', async () => {
      (usersService.isOwner as jest.Mock).mockResolvedValue(false);

      await expect(service.aiUpdateNickname(testToken, testUserId, oldNickname)).rejects.toThrow(UnauthorizedException);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(mockFetch).not.toHaveBeenCalled();
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if AI returns non-string response', async () => {
      (usersService.isOwner as jest.Mock).mockResolvedValue(true);
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ response: 123 }), // AI возвращает число
      });

      await expect(service.aiUpdateNickname(testToken, testUserId, oldNickname)).rejects.toThrow(BadRequestException);
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if fetch fails', async () => {
      (usersService.isOwner as jest.Mock).mockResolvedValue(true);
      mockFetch.mockRejectedValue(new Error('Network error')); // Имитируем ошибку сети

      await expect(service.aiUpdateNickname(testToken, testUserId, oldNickname)).rejects.toThrow(); // Ожидаем любое исключение
      expect(usersService.isOwner).toHaveBeenCalledWith(testToken, Number(testUserId));
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(usersService.update).not.toHaveBeenCalled();
    });
  });
});