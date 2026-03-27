
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import './index.css';
import Users from './pages/Users';
import { NotFound } from './pages/404';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App;
