import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListUsersDto } from '../../../application/dto/user-dtos/list-users.dto';
import type { IUserRepository } from '../../repositories/user.repository';
import { UserResponseDto } from '../../../application/dto/user-dtos/user-response.dto';

@Injectable()
export class ListUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ListUsersDto): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll(input.role);

    if (!users) {
      throw new NotFoundException('Nenhum usuário encontrado.');
    }

    return users.map((user) => UserResponseDto.fromEntity(user));
  }
}
