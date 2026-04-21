import { FeedbackEntity } from '../entities/feedback.entity';

export interface IFeedbackRepository {
  /**
   * Salva um feedback/nota dado por um instrutor a uma submissão de aluno.
   * @param feedback A entidade FeedbackEntity.
   * @returns O feedback salvo.
   */
  create(feedback: FeedbackEntity): Promise<FeedbackEntity>;

  /**
   * Busca um feedback específico pelo seu ID.
   * @param id O ID do feedback.
   * @returns O feedback encontrado ou null.
   */
  findById(id: string): Promise<FeedbackEntity | null>;

  /**
   * Busca o feedback correspondente a uma submissão específica.
   * @param submissionId O ID da submissão do exercício.
   * @returns O feedback da submissão ou null se ainda não foi corrigido.
   */
  findBySubmissionId(submissionId: string): Promise<FeedbackEntity | null>;

  /**
   * Busca todos os feedbacks dados por um instrutor específico.
   * @param instructorId O ID do instrutor.
   * @returns Uma lista de feedbacks dados por este instrutor.
   */
  findByInstructorId(instructorId: string): Promise<FeedbackEntity[]>;

  /**
   * Atualiza o comentário ou nota de um feedback existente.
   * @param feedback A entidade FeedbackEntity atualizada.
   * @returns O feedback atualizado.
   */
  update(feedback: FeedbackEntity): Promise<FeedbackEntity>;

  /**
   * Remove um feedback do banco de dados.
   * @param id O ID do feedback.
   * @returns Sem retorno.
   */
  delete(id: string): Promise<void>;
}
