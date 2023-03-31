import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from "./Dashboard";
import Account from "./Account";
import Form from './Form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<Form/>}/>
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
