import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';
import Users from './pages/Users';
import { NotFound } from './pages/404';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import Items from './pages/Items';
import Chat from './pages/Chat.tsx';
  
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/inventory/:id" element={<Inventory />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/items" element={<Items />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Layout>
  );
}

export default App;
