// Injeta Controller(), cria a classe, cria construtor com métodos de useCase baseado nos
// originais, cria as rotas/controllers com o body ou query usando Body() e Query()

import { UserRole } from '../../../domain/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../../../application/dto/user-dtos/create-user.dto';
import { DeleteUserDto } from '../../../application/dto/user-dtos/delete-user.dto';
import { GetUserDto } from '../../../application/dto/user-dtos/get-user.dto';
import { ListUsersDto } from '../../../application/dto/user-dtos/list-users.dto';
import { UpdateUserDto } from '../../../application/dto/user-dtos/update-user.dto';
import { CreateUserUseCase } from '../../../domain/usecases/user-usecases/create-user.usecase';
import { DeleteUserUseCase } from '../../../domain/usecases/user-usecases/delete-user.usecase';
import { GetUserUseCase } from '../../../domain/usecases/user-usecases/get-user.usecase';
import { ListUserUseCase } from '../../../domain/usecases/user-usecases/list-user.usecase';
import { UpdateUserUseCase } from '../../../domain/usecases/user-usecases/update-user.usecase';
import { LoginUserUseCase } from '../../../domain/usecases/user-usecases/login-user.usecase';
import { LoginUserDto } from '../../../application/dto/user-dtos/login-user.dto';

@Controller('users') // users = prefixo das rotas backend
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUserUseCase: ListUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) { }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.createUserUseCase.execute(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.loginUserUseCase.execute(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    // Busca perfil logado usando o email do token injetado pelo Passport
    const emailDto: GetUserDto = { email: req.user.email };
    return await this.getUserUseCase.execute(emailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByEmail(@Query('email') email: GetUserDto) {
    return await this.getUserUseCase.execute(email);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.admin)
  @Get('all')
  async findAll(@Query('role') role: ListUsersDto) {
    return await this.listUserUseCase.execute(role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() body: UpdateUserDto) {
    return await this.updateUserUseCase.execute(body);
  }

  // URL: DELETE /users/me
  // Autenticado via JWT
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req) {
    const dto: DeleteUserDto = { email: req.user.email };
    return await this.deleteUserUseCase.execute(dto);
  }
}
