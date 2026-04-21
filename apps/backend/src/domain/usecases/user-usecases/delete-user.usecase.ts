import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteUserDto } from '../../../application/dto/user-dtos/delete-user.dto';
import type { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: DeleteUserDto): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.userRepository.delete(input.email);
  }
}
