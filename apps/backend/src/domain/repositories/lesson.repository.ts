import { LessonEntity } from '../entities/lesson.entity';

export interface ILessonRepository {
  /**
   * Salva uma nova aula no banco de dados.
   * @param lesson A entidade de domínio LessonEntity a ser salva.
   * @returns A aula salva.
   */
  create(lesson: LessonEntity): Promise<LessonEntity>;

  /**
   * Busca uma aula específica pelo seu ID.
   * @param id O ID da aula.
   * @returns A aula encontrada ou null se não existir.
   */
  findById(id: string): Promise<LessonEntity | null>;

  /**
   * Busca todas as aulas pertencentes a um curso específico.
   * @param courseId O ID do curso.
   * @returns Uma lista de aulas do curso.
   */
  findByCourseId(courseId: string): Promise<LessonEntity[]>;

  /**
   * Busca uma aula específica de um curso com base na sua ordem (ex: Aula 1).
   * @param courseId O ID do curso.
   * @param order O número de ordem da aula.
   * @returns A aula correspondente ou null.
   */
  findByCourseIdAndOrder(
    courseId: string,
    order: number,
  ): Promise<LessonEntity | null>;

  /**
   * Atualiza as informações de uma aula existente.
   * @param lesson A entidade LessonEntity com os dados atualizados.
   * @returns A aula atualizada.
   */
  update(lesson: LessonEntity): Promise<LessonEntity>;

  /**
   * Remove uma aula do banco de dados pelo seu ID.
   * @param id O ID da aula a ser removida.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
