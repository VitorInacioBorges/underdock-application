import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import {
  EnrollmentRole,
  EnrollmentStatus,
} from '../../../domain/entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  userId: string;

  @IsUUID('4', { message: 'O ID do curso informado é inválido' })
  @IsNotEmpty({ message: 'O ID do curso é obrigatório' })
  courseId: string;

  @IsEnum(EnrollmentRole, { message: 'O papel deve ser student ou instructor' })
  @IsNotEmpty({ message: 'O papel na matrícula é obrigatório' })
  role: EnrollmentRole;

  @IsEnum(EnrollmentStatus, {
    message: 'O status deve ser active, completed ou canceled',
  })
  @IsNotEmpty({ message: 'O status da matrícula é obrigatório' })
  status: EnrollmentStatus;
}

// Informação para a Requisição

/*
    {
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "courseId": "987e6543-e21b-12d3-a456-426614174111",
        "role": "student",
        "status": "active"
    }
*/
