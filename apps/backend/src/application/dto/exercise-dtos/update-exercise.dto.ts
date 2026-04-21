import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateExerciseDto {
    @IsOptional()
    @IsString({ message: 'O título deve ser um texto.' })
    @IsNotEmpty({ message: 'O título não pode ser vazio.' })
    @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    title?: string;

    @IsOptional()
    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
    description?: string;

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
        "title": "Exercício Atualizado",
        "description": "Nova descrição do exercício."
    }
*/
