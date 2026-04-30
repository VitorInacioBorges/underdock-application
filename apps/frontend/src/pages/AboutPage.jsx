import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/pages-styles/AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* ─── Seção 1 · Sobre (imagem à esquerda) ──────────── */}
        <section className={styles.section}>
          <div className={styles.imageWrap}>
            <img
              src="/images/about-page/about.jpeg"
              alt="Estudantes colaborando em projetos"
              className={styles.image}
            />
          </div>

          <div className={styles.textWrap}>
            <span className={styles.label}>SOBRE</span>

            <h2 className={styles.heading}>
              UnderDock: uma ferramenta para conectar conhecimento a quem mais precisa.
            </h2>

            <p className={styles.body}>
              <strong>Uma plataforma de cursos pensada para ir além do comum</strong>{' '}
              — onde cada aula é estruturada com cuidado, cada exercício é desenhado
              para fixação real e cada aluno encontra um ambiente preparado para o
              aprendizado prático. Utiliza de metodologia ativa para uma aprendizagem mais significativa
              e real, de modo a fazer o aluno aprender de forma suscinta e objetiva.
            </p>

            <p className={styles.bodyMuted}>
              Criado por Vitor Inacio. Disponível para todos.
            </p>
          </div>
        </section>

        {/* ─── Seção 2 · Por quê (imagem à direita) ─────────── */}
        <section className={`${styles.section} ${styles.reversed}`}>
          <div className={styles.imageWrap}>
            <img
              src="/images/about-page/why.jpeg"
              alt="Pessoa estudando em casa com foco"
              className={styles.image}
            />
          </div>

          <div className={styles.textWrap}>
            <span className={styles.label}>POR QUÊ</span>

            <h2 className={styles.heading}>
              Porque educação de qualidade não deveria ter barreiras.
            </h2>

            <p className={styles.body}>
              <strong>A motivação por trás do CourseManager</strong> — nasceu da
              necessidade de reunir conteúdo técnico consistente em um único lugar,
              com acompanhamento de progresso, exercícios interativos e uma experiência
              que respeita o tempo de quem está aprendendo, de modo que estudantes insatisfeitos com o modelo atual de educação possam
              contribuir para com estudantes e melhorar a forma como aprendemos e ensinamos.
            </p>

            <p className={styles.bodyMuted}>
              Feito para estudantes por estudantes.
            </p>
          </div>
        </section>

        {/* ─── Seção 3 · Features (imagem à esquerda) ───────── */}
        <section className={styles.section}>
          <div className={styles.imageWrap}>
            <img
              src="/images/about-page/features.jpeg"
              alt="Workspace moderno com dashboard"
              className={styles.image}
            />
          </div>

          <div className={styles.textWrap}>
            <span className={styles.label}>FEATURES</span>

            <h2 className={styles.heading}>
              Tudo que você precisa para aprender de verdade.
            </h2>

            <ul className={styles.featureList}>
              <li>Cursos completos com aulas em vídeo</li>
              <li>Exercícios interativos via notebooks</li>
              <li>Painel administrativo para criação de conteúdo</li>
              <li>Acompanhamento de progresso por curso</li>
              <li>Autenticação segura e perfil personalizado</li>
              <li>Design responsivo e acessível</li>
              <li>Conteúdo profundo sobre tecnologia e desenvolvimento de software</li>
              <li>Possibilidade de contribuição de forma aberta e colaborativa</li>
            </ul>
          </div>
        </section>

        {/* ─── Seção 4 · Autor (imagem à direita) ───────────── */}
        <section className={`${styles.section} ${styles.reversed}`}>
          <div className={styles.imageWrap}>
            <img
              src="/images/about-page/me.png"
              alt="Vitor Inacio Borges"
              className={styles.image}
            />
          </div>

          <div className={styles.textWrap}>
            <span className={styles.label}>AUTOR</span>

            <h2 className={styles.heading}>
              Vitor Inacio Borges
            </h2>

            <p className={styles.body}>
              <strong>Desenvolvedor full-stack e estudante permanente</strong> —
              apaixonado por criar soluções tecnológicas que geram impacto real.
              O CourseManager é um projeto que une engenharia de software moderna
              com o desejo de democratizar o acesso ao conhecimento técnico.
            </p>

            <p className={styles.bodyMuted}>
              Engenheiro de Software, programador FullStack, artista, produtor de conteúdo e entusiasta de tecnologia.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
