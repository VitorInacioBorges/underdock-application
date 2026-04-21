import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSelfEnrollmentDto {
    @IsUUID('4', { message: 'O ID do curso informado é inválido' })
    @IsNotEmpty({ message: 'O ID do curso é obrigatório' })
    courseId: string;
}