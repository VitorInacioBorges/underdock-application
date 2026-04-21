import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateExerciseDto {
    @IsUUID('4', { message: 'O ID da aula informado é inválido' })
    @IsNotEmpty({ message: 'O ID da aula é obrigatório' })
    lessonId: string;

    @IsString({ message: 'O título deve ser um texto.' })
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    title: string;

    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsNotEmpty({ message: 'A descrição é obrigatória.' })
    description: string;

    // Metadados do notebook — preenchidos pelo controller a partir do arquivo enviado
    @IsOptional()
    notebookPath?: string;

    @IsOptional()
    notebookFileName?: string;

    @IsOptional()
    notebookMimeType?: string;

    @IsOptional()
    notebookSize?: number;
}

// Informação para a Requisição

/*
    {
        "lessonId": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Exercício de Fixação - NestJS",
        "description": "Crie uma rota GET que retorna a lista de usuários."
    }
*/
