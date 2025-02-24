import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import User from "./pages/User";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const role = localStorage.getItem("token");

  if (!role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      <Route path="/superadmin" element={<PrivateRoute><SuperAdmin /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
