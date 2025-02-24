import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Para asegurar que se envían las credenciales (JWT)
        }
      );

      const { token, role } = response.data;

      // Guardar el token en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirigir según el rol
      if (role === "USER") navigate("/user");
      if (role === "ADMIN") navigate("/admin");
      if (role === "SUPERADMIN") navigate("/superadmin");
    } catch (err) {
      setError("Usuario o Contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
