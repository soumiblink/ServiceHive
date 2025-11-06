import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { clearUser, userExist } from "../redux/reducers/auth";
import api from "../axios"; // <-- IMPORTANT (using axios instance)
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;

      if (activeTab === 1) {
        // Register
        const res = await api.post("/user/register", { name, email, password });
        data = res.data;
      } else {
        // Login
        const res = await api.post("/user/login", { email, password });
        data = res.data;
      }

      if (data) {
        toast.success(data?.msg || "Success");
        dispatch(userExist(data?.user));
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
              textAlign: "center",
              py: 3,
            }}
          >
            <Typography component="h1" variant="h4" fontWeight="bold">
              SlotSwapper
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
              Smart Time Slot Exchange
            </Typography>
          </Box>

          {/* Form */}
          <CardContent sx={{ p: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: "#466cf2ff",
                  height: 3,
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
              {activeTab === 1 && (
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                required
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                {loading
                  ? "Please wait..."
                  : activeTab === 0
                  ? "Login"
                  : "Register"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
