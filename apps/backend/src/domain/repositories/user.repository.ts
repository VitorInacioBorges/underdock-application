import { UserEntity, UserRole } from '../entities/user.entity';

export interface IUserRepository {
  /**
   * Salva um usuário no banco de dados.
   * @param user A entidade de domínio User
   * @returns O usuário salvo (com ID e createdAt preenchidos se for criação)
   */
  create(user: UserEntity): Promise<UserEntity>;

  /**
   * Busca um usuário pelo email.
   * Usado para evitar cadastros duplicados.
   * @param email O email a ser buscado
   * @returns O usuário encontrado ou null
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Busca e lista todos os usuários.
   * @param role O cargo daquele que busca
   * @returns Todos os Usuários
   */
  findAll(role?: UserRole): Promise<UserEntity[] | null>;

  /**
   * Atualiza usuários e suas caracteristicas no banco de dados.
   * @param user O usuário desatualizado.
   * @returns O usuário atualizado.
   */
  update(user: UserEntity): Promise<UserEntity>;

  /**
   * Deleta usuários e suas caracteristicas no banco de dados.
   * @param user O usuário desatualizado.
   * @returns Sem retorno.
   */
  delete(email: string): Promise<void>;
}
