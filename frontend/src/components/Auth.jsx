import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { authAPI } from "../services/api";

const Auth = ({ onAuthenticated }) => {
  const [currentView, setCurrentView] = useState("login"); // 'login' or 'signup'

  const handleLogin = async (formData) => {
    try {
      const response = await authAPI.login(formData.email, formData.password);
      onAuthenticated(response.user);
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  };

  const handleSignup = async (formData) => {
    try {
      const response = await authAPI.register(
        formData.username,
        formData.email,
        formData.password
      );
      onAuthenticated(response.user);
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const switchToLogin = () => setCurrentView("login");
  const switchToSignup = () => setCurrentView("signup");

  return (
    <>
      {currentView === "login" ? (
        <Login onSwitchToSignup={switchToSignup} onLogin={handleLogin} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} onSignup={handleSignup} />
      )}
    </>
  );
};

export default Auth;
