import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AdminContext } from "./context/AdminContext";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddFlight from "./pages/AddFlight";

const App = () => {
  const { adminUser } = useContext(AdminContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={adminUser ? <Navigate to="/" /> : <Login />}
        />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-flight" element={<AddFlight />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
