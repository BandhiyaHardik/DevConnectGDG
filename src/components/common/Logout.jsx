import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

// Clear all app-related storage
function clearAppStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        clearAppStorage();
        navigate("/login", { replace: true });
        // If you still see dashboard after logout, uncomment:
        // window.location.reload();
      })
      .catch((error) => {
        console.error("Logout error:", error);
        clearAppStorage();
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return <div>Logging you out...</div>;
};

export default Logout;