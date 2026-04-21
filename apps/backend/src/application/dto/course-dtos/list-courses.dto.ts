import { IsBooleanString, IsOptional } from 'class-validator';

export class ListCoursesDto {
  @IsOptional()
  @IsBooleanString({ message: 'O filtro de publicação deve ser true ou false' })
  isPublished?: string; // Query params sempre chegam como string na URL
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query opcionais para filtro.
    URL: https://url:PORT/api/courses/list?isPublished=true
*/
