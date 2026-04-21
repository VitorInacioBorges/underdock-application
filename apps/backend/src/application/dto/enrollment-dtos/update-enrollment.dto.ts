import { IsEnum, IsOptional } from 'class-validator';
import {
  EnrollmentRole,
  EnrollmentStatus,
} from '../../../domain/entities/enrollment.entity';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsEnum(EnrollmentRole, { message: 'O papel deve ser student ou instructor' })
  role?: EnrollmentRole;

  @IsOptional()
  @IsEnum(EnrollmentStatus, {
    message: 'O status deve ser active, completed ou canceled',
  })
  status?: EnrollmentStatus;
}

// Informação para a Requisição

/*
    {
        "status": "completed"
    }
*/
