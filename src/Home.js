// Import Route and useParams from 'react-router-dom'
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { useNavigate,  Link, Routes, Route } from "react-router-dom";
import "./Home.css";
import Dashboard from "./Dashboard";
import Account from "./Account";
import logo from "./logo.svg";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="drawer">
      <div className="logo-container">
        <img src={logo} alt="Your Logo" />
        </div>
        <Link to="dashboard">Dashboard</Link>
        <Link to="account">Account</Link>
        <button onClick={() => auth.signOut()} className="logout-button">
          Logout
        </button>
      </div>
      <div className="content">
      <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="account"
            element={<Account userEmail={user ? user.email : null} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
