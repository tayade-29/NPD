import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true }); // Redirect to login page
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
      Logout
    </button>
  );
}

export default LogoutButton;
