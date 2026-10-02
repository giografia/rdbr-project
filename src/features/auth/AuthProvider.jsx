import { useEffect, useRef, useState } from "react";
import * as authApi from "../../api/auth";
import { AuthContext } from "./authContext";
import LoginModal from "./LoginModal";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [activeModal, setActiveModal] = useState(null); // login or register or null
  const pendingAction = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    authApi
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setIsBooting(false));
  }, []);

  //save session, close modal and resume prev action
  function finishAuth({ user, token }) {
    localStorage.setItem("token", token);
    setUser(user);
    setActiveModal(null);

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.(user);
  }

  async function login(credentials) {
    finishAuth(await authApi.login(credentials));
  }
  async function register(formData) {
    finishAuth(await authApi.register(formData));
  }
  async function logout() {
    try {
      await authApi.logout();
    } catch {
      //logout locally even if error
    }
    localStorage.removeItem("token");
    setUser(null);
  }

  function requireAuth(action) {
    if (user) {
      action(user);
      return;
    }
    pendingAction.current = action;
    setActiveModal("login");
  }
  function closeModal() {
    pendingAction.current = null;
    setActiveModal(null);
  }

  const value = {
    user,
    isBooting,
    login,
    register,
    logout,
    requireAuth,
    openLogin: () => setActiveModal("login"),
    openRegister: () => setActiveModal("register"),
    closeModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {activeModal === "login" && (
        <LoginModal
          onClose={closeModal}
          onSwitchToRegister={() => setActiveModal("register")}
        />
      )}
      {/* registration modal will be here in future */}
    </AuthContext.Provider>
  );
}
