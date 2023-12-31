import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'findOneByEmail' })
  async findOneByEmail(email: string): Promise<{ id: string }> {
    const user = await this.userService.findOneByEmail(email);

    return { id: user?.id || null };
  }

  @MessagePattern({ cmd: 'create' })
  async create({ email, password }: { email: string; password: string }): Promise<{ id: string }> {
    const user = await this.userService.create(email, password);

    return { id: user.id };
  }

  @MessagePattern({ cmd: 'validate' })
  async validate({ email, password }: { email: string; password: string }): Promise<{ id: string }> {
    const { id } = await this.userService.validate(email, password);

    return { id };
  }

  @MessagePattern({ cmd: 'checkUserIsAdmin' })
  async checkUserIsAdmin(uuid: string): Promise<{ id: boolean }> {
    const { id } = await this.userService.checkUserIsAdmin(uuid);

    return { id };
  }
}
