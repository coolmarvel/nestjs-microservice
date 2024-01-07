import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async findOneByEmail(email: string) {
    const pattern = { cmd: 'findOneByEmail' };
    const payload = email;
    const { id: userId } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));

    return userId;
  }

  async create(email: string, password: string) {
    const pattern = { cmd: 'create' };
    const payload = { email, password };
    const { id: userId } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));

    return userId;
  }

  // TODO
  async validateUser(email: string, password: string) {
    const pattern = { cmd: 'validate' };
    const payload = { email, password };
    const { id } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));

    return id;
  }

  // TODO
  async checkUserIsAdmin(uuid: string) {
    const pattern = { cmd: 'checkUserIsAdmin' };
    const payload = { uuid };
    const { id } = await firstValueFrom<{ id: string }>(this.client.send<{ id: string }>(pattern, payload));

    return Boolean(id);
  }
}
