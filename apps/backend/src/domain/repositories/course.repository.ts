import { CourseEntity } from '../entities/course.entity';

export interface ICourseRepository {
  /**
   * Salva um novo curso no banco de dados.
   * @param course A entidade de domínio CourseEntity a ser salva.
   * @returns O curso salvo com ID e datas geradas.
   */
  create(course: CourseEntity): Promise<CourseEntity>;

  /**
   * Busca um curso específico pelo seu ID.
   * @param id O ID do curso.
   * @returns O curso encontrado ou null se não existir.
   */
  findById(id: string): Promise<CourseEntity | null>;

  /**
   * Retorna todos os cursos cadastrados (para painel admin).
   * @returns Uma lista de todos os cursos.
   */
  findAll(): Promise<CourseEntity[]>;

  /**
   * Retorna apenas os cursos que estão publicados e visíveis para alunos.
   * @returns Uma lista de cursos publicados.
   */
  findPublished(): Promise<CourseEntity[]>;

  /**
   * Atualiza as informações de um curso existente.
   * @param course A entidade CourseEntity com os dados atualizados.
   * @returns O curso atualizado.
   */
  update(course: CourseEntity): Promise<CourseEntity>;

  /**
   * Remove um curso do banco de dados pelo seu ID.
   * @param id O ID do curso a ser removido.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
