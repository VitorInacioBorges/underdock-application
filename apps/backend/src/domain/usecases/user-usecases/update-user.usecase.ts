import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from '../../../application/dto/user-dtos/update-user.dto';
import { UserResponseDto } from '../../../application/dto/user-dtos/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (input.name) {
      user.name = input.name;
    }
    if (input.email) {
      user.email = input.email;
    }
    if (input.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hashSync(input.password, salt);
    }

    const updatedUser = await this.userRepository.update(user);

    return UserResponseDto.fromEntity(updatedUser);
  }
}
