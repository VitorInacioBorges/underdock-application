import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../repositories/user.repository';
import { UserResponseDto } from '../../../application/dto/user-dtos/user-response.dto';
import { GetUserDto } from '../../../application/dto/user-dtos/get-user.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return UserResponseDto.fromEntity(user);
  }
}
