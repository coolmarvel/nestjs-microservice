import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async singup(email: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error: any;
    try {
      const userId = await this.userService.findOneByEmail(email);
      if (userId) throw new BadRequestException();

      const newUserId = await this.userService.create(email, password);
      const accessToken = this.generateAccessToken(newUserId);
      const refreshTokenEntity = queryRunner.manager.create(RefreshToken, { userId: newUserId, token: this.generateRefreshToken(newUserId) });

      queryRunner.manager.save(refreshTokenEntity);
      await queryRunner.commitTransaction();

      return { id: newUserId, accessToken, refreshToken: refreshTokenEntity.token };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();

      if (error) throw error;
    }
  }

  async signin(email: string, password: string) {
    const userId = await this.userService.validateUser(email, password);

    const refreshToken = this.generateRefreshToken(userId);
    await this.createRefreshTokenUsingUser(userId, refreshToken);

    return { accessToken: this.generateAccessToken(userId), refreshToken };
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({ token });
    if (!refreshTokenEntity) throw new BadRequestException();

    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    refreshTokenEntity.token = refreshToken;

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string) {
    const payload = { sub: userId, tokenType: 'access' };

    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private generateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refresh' };

    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async createRefreshTokenUsingUser(userId: string, refreshToken: string) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({ userId });

    if (refreshTokenEntity) refreshTokenEntity.token = refreshToken;
    else refreshTokenEntity = this.refreshTokenRepository.create({ userId, token: refreshToken });

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
