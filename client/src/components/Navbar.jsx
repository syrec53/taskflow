import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-brand-icon">⚡</div>
        <span>TaskFlow</span>
      </Link>

      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            Hi, <strong>{user.name.split(' ')[0]}</strong>
          </span>
        )}
        <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
