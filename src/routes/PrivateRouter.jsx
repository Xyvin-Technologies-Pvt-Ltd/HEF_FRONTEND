import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuth =localStorage.getItem("4ZbQwXtY8uVrN5mP7kL3JhF6");
  return isAuth ? children : <Navigate to="/members" />;
};
