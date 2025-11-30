import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/home';
import Trade from './views/buyingSeling';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buying-selling" element={<Trade />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
