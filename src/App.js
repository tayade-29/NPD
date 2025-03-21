import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login';
import APQPTable from './Forms/ApqpTable';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/apqpForm" element={<APQPTable/>}></Route>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
