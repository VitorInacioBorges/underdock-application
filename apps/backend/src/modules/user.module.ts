import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from '../domain/usecases/user-usecases/create-user.usecase';
import { DeleteUserUseCase } from '../domain/usecases/user-usecases/delete-user.usecase';
import { GetUserUseCase } from '../domain/usecases/user-usecases/get-user.usecase';
import { ListUserUseCase } from '../domain/usecases/user-usecases/list-user.usecase';
import { UpdateUserUseCase } from '../domain/usecases/user-usecases/update-user.usecase';
import { LoginUserUseCase } from '../domain/usecases/user-usecases/login-user.usecase';
import { UserController } from '../infrastructure/http/controllers/user.controller';
import { UserOrmEntity } from '../infrastructure/database/orm/user.orm-entity';
import { TypeOrmUserRepository } from '../infrastructure/database/typeorm/repositories/typeorm-user.repository';
TypeOrmUserRepository;
@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]), // Registra a entidade no TypeORM
  ],
  controllers: [UserController], // Registra o controller
  providers: [
    // Registra todos os use cases
    CreateUserUseCase,
    GetUserUseCase,
    ListUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    LoginUserUseCase,

    // Inversão de dependência no repositório
    {
      provide: 'IUserRepository', // Registra repositório usado no Inject() do NestJS
      useClass: TypeOrmUserRepository, // Registra a classe usada
    },
  ],
  exports: [
    // Exporta use cases caso outras classes precisem usá-los
    CreateUserUseCase,
    GetUserUseCase,
  ],
})
export class UserModule { }
