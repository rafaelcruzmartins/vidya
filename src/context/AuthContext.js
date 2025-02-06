import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Logged In");
  const [toastType, setToastType] = useState("success");

  const navigate = useNavigate();
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/user", {
        withCredentials: true,
      });
      setUser(response.data);
      console.log(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        setIsSubmitting(false);
        setToastMessage("Logged In");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setIsSubmitting(false);
      error.status === 400
        ? setToastMessage("cridentials can't be empty")
        : setToastMessage("error registering");
      error.status === 401 && setToastMessage("Invalid Credentials");
      setToastType("error");
      setShowToast(true);
      console.error(error);
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {
      withCredentials: true,
    });
    setUser(null);
    setShowToast(false);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isSubmitting,
    showToast,
    toastMessage,
    toastType,
    setShowToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
