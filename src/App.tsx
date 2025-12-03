import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/home';
import Trade from './views/buy';
import './App.css';
import Wallet from './views/wallet';
import SendBitcoin from './views/send';
import Login from './views/login';
import AdminDashboard from './views/admin';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buying-selling" element={<Trade />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/send" element={<SendBitcoin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
