// Dto de response para evitar conflito na resposta dos usecases
// Evita problemas como criação de regras de negócio que não entram na response
// Contém todas as propriedades de 'user' exceto pela senha para a não exposição

import { UserEntity } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;

  static fromEntity(user: UserEntity): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id as string;
    response.name = user.name;
    response.email = user.email;
    response.role = user.role;
    response.createdAt = user.createdAt ?? new Date();

    return response;
  }
}
