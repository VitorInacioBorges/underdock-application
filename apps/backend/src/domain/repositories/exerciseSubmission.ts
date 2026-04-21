import {
  ExerciseSubmissionEntity,
  ExerciseSubmissionStatus,
} from '../entities/exerciseSubmission.entity';

export interface IExerciseSubmissionRepository {
  /**
   * Salva a submissão (resposta/arquivo) de um aluno para um exercício.
   * @param submission A entidade ExerciseSubmissionEntity.
   * @returns A submissão salva no banco.
   */
  create(
    submission: ExerciseSubmissionEntity,
  ): Promise<ExerciseSubmissionEntity>;

  /**
   * Busca uma submissão específica pelo seu ID.
   * @param id O ID da submissão.
   * @returns A submissão encontrada ou null.
   */
  findById(id: string): Promise<ExerciseSubmissionEntity | null>;

  /**
   * Busca todas as respostas enviadas para um determinado exercício.
   * Utilizado pelos instrutores para listar atividades a serem corrigidas.
   * @param exerciseId O ID do exercício.
   * @returns Uma lista de submissões daquele exercício.
   */
  findByExerciseId(exerciseId: string): Promise<ExerciseSubmissionEntity[]>;

  /**
   * Busca todo o histórico de exercícios entregues por um aluno.
   * @param userId O ID do aluno.
   * @returns Uma lista de submissões feitas por este usuário.
   */
  findByUserId(userId: string): Promise<ExerciseSubmissionEntity[]>;

  /**
   * Verifica se o aluno já enviou uma resposta para um determinado exercício.
   * @param userId O ID do aluno.
   * @param exerciseId O ID do exercício.
   * @returns A submissão correspondente ou null se ainda não enviou.
   */
  findByUserAndExercise(
    userId: string,
    exerciseId: string,
  ): Promise<ExerciseSubmissionEntity | null>;

  /**
   * Busca submissões por status (ex: listar todas as submissões "pending" que precisam de correção).
   * @param status O status da submissão (pendente ou revisado).
   * @returns Uma lista de submissões filtradas pelo status.
   */
  findByStatus(
    status: ExerciseSubmissionStatus,
  ): Promise<ExerciseSubmissionEntity[]>;

  /**
   * Atualiza uma submissão existente (ex: mudar status para revisado).
   * @param submission A entidade atualizada.
   * @returns A submissão atualizada.
   */
  update(
    submission: ExerciseSubmissionEntity,
  ): Promise<ExerciseSubmissionEntity>;

  /**
   * Deleta uma submissão do banco de dados.
   * @param id O ID da submissão.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
