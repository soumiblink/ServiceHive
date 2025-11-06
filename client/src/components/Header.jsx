import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Store as MarketplaceIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddEventModal from "../components/AddEventModal";
import api, {
  useCreateEventMutation,
  useGetMySwapRequestsQuery,
} from "../redux/api/api";
import { clearUser } from "../redux/reducers/auth";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);

  const [createEvent] = useCreateEventMutation();

  const { data: swapRequestsData } = useGetMySwapRequestsQuery();

  const pendingIncomingCount =
    swapRequestsData?.incoming?.filter(
      (request) => request.status === "PENDING"
    )?.length || 0;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddEvent = () => {
    setAddEventModalOpen(true);
    navigate("/");
  };

  const handleMarketplace = () => {
    navigate("/request-swap");
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/user/logout`,
        { withCredentials: true }
      );
      if (data) {
        toast.success(data?.msg);
        dispatch(clearUser());
        dispatch(api.util.resetApiState());
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Couldn't logout!");
    }
  };

  const handleCloseModal = () => {
    setAddEventModalOpen(false);
  };

  const handleAddNewEvent = async (data) => {
    setAddEventModalOpen(false);
    try {
      const res = await createEvent(data);
      if (res?.data) {
        toast.success(res?.data?.msg);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Cannot create Event!");
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #466cf2ff 0%, #09d2f1ff 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            SlotSwapper
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Tooltip title="Add Event" arrow>
              <IconButton
                onClick={handleAddEvent}
                sx={iconStyle}
                size={isMobile ? "small" : "medium"}
              >
                <AddIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Marketplace" arrow>
              <IconButton
                onClick={handleMarketplace}
                sx={iconStyle}
                size={isMobile ? "small" : "medium"}
              >
                <MarketplaceIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications" arrow>
              <IconButton
                onClick={handleNotifications}
                sx={iconStyle}
                size={isMobile ? "small" : "medium"}
              >
                <Badge
                  badgeContent={pendingIncomingCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                      height: { xs: 16, sm: 18 },
                      minWidth: { xs: 16, sm: 18 },
                      // Hide badge when count is 0
                      display: pendingIncomingCount === 0 ? "none" : "flex",
                    },
                  }}
                >
                  <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout" arrow>
              <IconButton
                onClick={handleLogout}
                sx={iconStyle}
                size={isMobile ? "small" : "medium"}
              >
                <LogoutIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Add Event Modal */}
      <AddEventModal
        open={addEventModalOpen}
        onClose={handleCloseModal}
        onAddEvent={handleAddNewEvent}
      />
    </>
  );
};

const iconStyle = {
  color: "white",
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
  "&:hover": {
    background: "rgba(255,255,255,0.3)",
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease",
  width: { xs: 36, sm: 40 },
  height: { xs: 36, sm: 40 },
};

export default Header;
