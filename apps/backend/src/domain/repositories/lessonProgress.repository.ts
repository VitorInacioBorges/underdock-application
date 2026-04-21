import { LessonProgressEntity } from '../entities/lessonProgress.entity';

export interface ILessonProgressRepository {
  /**
   * Registra o progresso inicial de um aluno em uma aula.
   * @param progress A entidade LessonProgressEntity.
   * @returns O registro de progresso salvo.
   */
  create(progress: LessonProgressEntity): Promise<LessonProgressEntity>;

  /**
   * Busca um registro de progresso pelo seu ID.
   * @param id O ID do progresso.
   * @returns O registro encontrado ou null.
   */
  findById(id: string): Promise<LessonProgressEntity | null>;

  /**
   * Busca o progresso de um usuário específico em uma aula específica.
   * @param userId O ID do aluno.
   * @param lessonId O ID da aula.
   * @returns O progresso encontrado ou null se ainda não iniciou a aula.
   */
  findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<LessonProgressEntity | null>;

  /**
   * Busca todo o histórico de aulas assistidas por um usuário.
   * @param userId O ID do aluno.
   * @returns Uma lista contendo o progresso das aulas do aluno.
   */
  findByUserId(userId: string): Promise<LessonProgressEntity[]>;

  /**
   * Atualiza o status de progresso (ex: marcar como assistido).
   * @param progress A entidade atualizada.
   * @returns O progresso atualizado.
   */
  update(progress: LessonProgressEntity): Promise<LessonProgressEntity>;

  /**
   * Remove um registro de progresso.
   * @param id O ID do registro de progresso.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
