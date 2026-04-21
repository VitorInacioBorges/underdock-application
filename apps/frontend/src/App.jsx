import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

/**
 * App — Raiz da aplicação.
 *
 * BrowserRouter é instanciado aqui (e não em main.jsx) para manter
 * o contexto de roteamento disponível para todos os componentes, incluindo
 * qualquer Provider futuro (tema, auth, etc.) que possa ser adicionado.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}