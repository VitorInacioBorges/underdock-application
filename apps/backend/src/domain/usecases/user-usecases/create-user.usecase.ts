import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../../application/dto/user-dtos/create-user.dto';
import { UserEntity } from '../../entities/user.entity';
import type { IUserRepository } from '../../repositories/user.repository';
import { UserResponseDto } from '../../../application/dto/user-dtos/user-response.dto';
import { AuthResponse } from './login-user.usecase';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: CreateUserDto): Promise<AuthResponse> {
    const userExists = await this.userRepository.findByEmail(input.email);

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const newUser = new UserEntity({
      name: input.name,
      email: input.email,
      passwordHash: passwordHash,
      role: input.role,
    });

    const savedUser = await this.userRepository.create(newUser);

    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: UserResponseDto.fromEntity(savedUser),
      accessToken,
    };
  }
}
