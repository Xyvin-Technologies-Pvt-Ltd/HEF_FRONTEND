import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isAuth = 1235;
  return isAuth ? children : <Navigate to="/members" />;
};
