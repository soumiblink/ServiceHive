import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userExist, clearUser } from "./redux/reducers/auth";

import Header from "./components/Header";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import { useEffect } from "react";
import ProtectedRoute from "./pages/ProtectedRoute";
import Marketplace from "./pages/Marketplace";
import Notifications from "./pages/Notifications";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/api/user/me`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        dispatch(userExist(data?.user));
      })
      .catch(() => {
        dispatch(clearUser());
      });
  }, [dispatch]);

  if (loading) return <Loader />;
  return (
    <Router>
      {user && <Header />}
      <Routes>
        <Route element={<ProtectedRoute user={user} redirect="/login" />}>
          <Route path="/" element={<Calendar />} />
          <Route path="/request-swap" element={<Marketplace />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route
          path="/login"
          element={
            <ProtectedRoute user={!user}>
              <Login />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position={"bottom-center"} />
    </Router>
  );
};

export default App;
