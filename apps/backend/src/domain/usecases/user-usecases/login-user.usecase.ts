import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../repositories/user.repository';
import { LoginUserDto } from '../../../application/dto/user-dtos/login-user.dto';
import { UserResponseDto } from '../../../application/dto/user-dtos/user-response.dto';
import { JwtService } from '@nestjs/jwt';

export interface AuthResponse {
  user: UserResponseDto;
  accessToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(data: LoginUserDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: UserResponseDto.fromEntity(user),
      accessToken,
    };
  }
}
