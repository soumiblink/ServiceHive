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
import axios from "axios";
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
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/user/register`,
          { name, email, password },
          { withCredentials: true }
        );
        data = res.data;
      } else {
        // Login
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/user/login`,
          { email, password },
          { withCredentials: true }
        );
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
      setLoading(false); // stop loading
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
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
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
              <Tab
                label="Login"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
              <Tab
                label="Register"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
              {activeTab === 1 && (
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />
              )}

              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete={
                  activeTab === 1 ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading} // disable button while loading
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a5fd8 0%, #7c51e0 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
                  },
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
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
