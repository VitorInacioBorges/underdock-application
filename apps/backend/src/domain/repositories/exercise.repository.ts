import { ExerciseEntity } from '../entities/exercise.entity';

export interface IExerciseRepository {
  /**
   * Cria um novo exercício atrelado a uma aula.
   * @param exercise A entidade ExerciseEntity a ser salva.
   * @returns O exercício salvo.
   */
  create(exercise: ExerciseEntity): Promise<ExerciseEntity>;

  /**
   * Busca um exercício específico pelo seu ID.
   * @param id O ID do exercício.
   * @returns O exercício encontrado ou null.
   */
  findById(id: string): Promise<ExerciseEntity | null>;

  /**
   * Busca todos os exercícios pertencentes a uma aula específica.
   * @param lessonId O ID da aula.
   * @returns Uma lista de exercícios daquela aula.
   */
  findByLessonId(lessonId: string): Promise<ExerciseEntity[]>;

  /**
   * Atualiza as informações de um exercício existente.
   * @param exercise A entidade ExerciseEntity com dados atualizados.
   * @returns O exercício atualizado.
   */
  update(exercise: ExerciseEntity): Promise<ExerciseEntity>;

  /**
   * Remove um exercício do banco de dados pelo seu ID.
   * @param id O ID do exercício a ser removido.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
