import { Routes, Route, Navigate } from "react-router";
import PropTypes from "prop-types";

import Navbar from "./components/Navbar";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Members from "./routes/Members";
import Books from "./routes/Books";
import Issuance from "./routes/Issuance";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const LoginRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : <Login />;
};

const routes = [
  { path: "/login", element: <LoginRedirect /> },
  { path: "/", element: <ProtectedRoute element={<Home />} /> },
  { path: "/members", element: <ProtectedRoute element={<Members />} /> },
  { path: "/books", element: <ProtectedRoute element={<Books />} /> },
  { path: "/issuance", element: <ProtectedRoute element={<Issuance />} /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AuthProvider>
  );
}

export default App;
