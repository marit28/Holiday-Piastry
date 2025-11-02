import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth";

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/home" />;

  return children;
};

export default RequireAdmin;
