import {useState, useCallback, useEffect} from "react";

const lsKey = 'registerData';

export const useAuth = () => {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(lsKey, JSON.stringify({userId, token}));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(lsKey);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(lsKey));
    if (data && data.token) {
      login(data.token, data.userId);
    }
  }, [login])

  return { login, logout, token, userId };
}