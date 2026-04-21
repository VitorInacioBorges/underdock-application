import { EnrollmentEntity } from '../entities/enrollment.entity';

export interface IEnrollmentRepository {
  /**
   * Cria uma nova matrícula de um usuário em um curso.
   * @param enrollment A entidade EnrollmentEntity a ser salva.
   * @returns A matrícula criada.
   */
  create(enrollment: EnrollmentEntity): Promise<EnrollmentEntity>;

  /**
   * Busca uma matrícula específica pelo seu ID.
   * @param id O ID da matrícula.
   * @returns A matrícula encontrada ou null.
   */
  findById(id: string): Promise<EnrollmentEntity | null>;

  /**
   * Busca todas as matrículas de um usuário (cursos em que ele está inscrito).
   * @param userId O ID do usuário (aluno ou instrutor).
   * @returns Uma lista de matrículas do usuário.
   */
  findByUserId(userId: string): Promise<EnrollmentEntity[]>;

  /**
   * Busca todas as matrículas de um usuário em um curso específico.
   * @param userId O ID do usuário (aluno ou instrutor).
   * @param courseId O ID do curso.
   * @returns Uma lista de matrículas do usuário neste curso.
   */
  findByUserIdAndCourseId(userId: string, courseId: string): Promise<EnrollmentEntity[]>;

  /**
   * Busca todas as matrículas atreladas a um curso específico.
   * @param courseId O ID do curso.
   * @returns Uma lista de matrículas neste curso.
   */
  findByCourseId(courseId: string): Promise<EnrollmentEntity[]>;

  /**
   * Verifica a matrícula de um usuário específico em um curso específico.
   * Utilizado para validar se o aluno tem acesso ao curso.
   * @param userId O ID do usuário.
   * @param courseId O ID do curso.
   * @returns A matrícula correspondente ou null se não estiver matriculado.
   */
  findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<EnrollmentEntity | null>;

  /**
   * Atualiza o status ou papel de uma matrícula existente.
   * @param enrollment A entidade EnrollmentEntity atualizada.
   * @returns A matrícula atualizada.
   */
  update(enrollment: EnrollmentEntity): Promise<EnrollmentEntity>;

  /**
   * Remove uma matrícula do banco de dados (cancelamento definitivo).
   * @param id O ID da matrícula.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
