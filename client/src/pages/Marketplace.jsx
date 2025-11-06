import { AccessTime, Person, SwapHoriz as SwapIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetMyEventsQuery,
  useGetSwappableSlotsQuery,
  useCreateSwapRequestMutation,
} from "../redux/api/api";
import { formatTime, getTypeColor } from "../utils/features";

const Marketplace = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [selectedMySlot, setSelectedMySlot] = useState(null);

  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
    isError: slotsIsError,
  } = useGetSwappableSlotsQuery();

  const { data: myEventsData, isLoading: myEventsLoading } =
    useGetMyEventsQuery();

  const [createSwapRequest, { isLoading: isCreatingSwap }] =
    useCreateSwapRequestMutation();

  useEffect(() => {
    if (slotsIsError) {
      toast.error(slotsError?.data?.msg || "Failed to load available slots");
    }
  }, [slotsIsError, slotsError]);

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setSwapDialogOpen(true);
  };

  const handleConfirmSwap = async () => {
    if (!selectedMySlot || !selectedSlot) return;

    try {
      const swapData = {
        mySlotId: selectedMySlot._id,
        theirSlotId: selectedSlot._id,
      };

      const result = await createSwapRequest(swapData).unwrap();

      toast.success(result.msg);
      setSwapDialogOpen(false);
      setSelectedSlot(null);
      setSelectedMySlot(null);
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to send swap request");
    }
  };

  const mySwappableSlots =
    myEventsData?.events?.filter((event) => event.status === "SWAPPABLE") || [];

  const availableSlots = slotsData?.slots || [];

  // Determine slot type based on title or duration
  const getSlotType = (slot) => {
    const title = slot.title.toLowerCase();
    const duration =
      (new Date(slot.endTime) - new Date(slot.startTime)) / (1000 * 60);

    if (title.includes("meeting")) return "Meeting";
    if (title.includes("review")) return "Review";
    if (title.includes("workshop") || title.includes("session"))
      return "Workshop";
    if (title.includes("presentation") || title.includes("demo"))
      return "Presentation";
    if (duration > 120) return "Workshop";
    if (duration > 60) return "Meeting";
    return "Quick Chat";
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Slot Marketplace
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Discover available time slots from colleagues and request swaps to
            optimize your schedule
          </Typography>
        </Box>

        {/* Loading State */}
        {slotsLoading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              Loading available slots...
            </Typography>
          </Box>
        )}

        {/* Available Slots Grid */}
        {!slotsLoading && (
          <Grid container spacing={3}>
            {availableSlots.map((slot) => {
              const slotType = getSlotType(slot);
              return (
                <Grid item xs={12} md={6} lg={4} key={slot._id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header with Type Chip */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={slotType}
                          color={getTypeColor(slotType)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        <AccessTime
                          sx={{ color: "text.secondary", fontSize: 20 }}
                        />
                      </Box>

                      {/* Slot Title */}
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ flexGrow: 1 }}
                      >
                        {slot.title}
                      </Typography>

                      {/* Time */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <AccessTime
                          sx={{ fontSize: 18, color: "primary.main", mr: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {formatTime(slot.startTime)}
                        </Typography>
                      </Box>

                      {/* Owner Info */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "secondary.main",
                            fontSize: "14px",
                            fontWeight: "bold",
                            mr: 2,
                          }}
                        >
                          {slot.owner.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {slot.owner.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {slot.owner.email}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<SwapIcon />}
                        onClick={() => handleRequestSwap(slot)}
                        disabled={mySwappableSlots.length === 0}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          fontWeight: 600,
                          fontSize: "1rem",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #5a5fd8 0%, #7c51e0 100%)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {mySwappableSlots.length === 0
                          ? "No Swappable Slots"
                          : "Request Swap"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Empty State */}
        {!slotsLoading && availableSlots.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No slots available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Check back later for new available slots
            </Typography>
          </Box>
        )}

        {/* Swap Request Dialog */}
        <Dialog
          open={swapDialogOpen}
          onClose={() => setSwapDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Request Swap
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select your slot to offer for "{selectedSlot?.title}"
            </Typography>
          </DialogTitle>

          <DialogContent>
            {/* Selected Slot Info */}
            {selectedSlot && (
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "primary.50",
                  border: "1px solid",
                  borderColor: "primary.100",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {selectedSlot.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime
                      sx={{ fontSize: 16, mr: 1, color: "primary.main" }}
                    />
                    <Typography variant="body2">
                      {formatTime(selectedSlot.startTime)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person
                      sx={{ fontSize: 16, mr: 1, color: "primary.main" }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {selectedSlot.owner.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Your Available Slots
            </Typography>

            {myEventsLoading ? (
              <Typography variant="body2" color="textSecondary">
                Loading your slots...
              </Typography>
            ) : mySwappableSlots.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                You don't have any swappable slots. Mark some events as
                "Swappable" in your calendar first.
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {mySwappableSlots.map((slot) => (
                  <ListItem
                    key={slot._id}
                    button
                    selected={selectedMySlot?._id === slot._id}
                    onClick={() => setSelectedMySlot(slot)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor:
                        selectedMySlot?._id === slot._id
                          ? "primary.main"
                          : "grey.200",
                      backgroundColor:
                        selectedMySlot?._id === slot._id
                          ? "primary.50"
                          : "white",
                      "&:hover": {
                        backgroundColor:
                          selectedMySlot?._id === slot._id
                            ? "primary.50"
                            : "grey.50",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600">
                          {slot.title}
                        </Typography>
                      }
                      secondary={formatTime(slot.startTime)}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setSwapDialogOpen(false)}
              sx={{ fontWeight: 600 }}
              disabled={isCreatingSwap}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSwap}
              variant="contained"
              disabled={
                !selectedMySlot ||
                mySwappableSlots.length === 0 ||
                isCreatingSwap
              }
              sx={{
                fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a5fd8 0%, #7c51e0 100%)",
                },
              }}
            >
              {isCreatingSwap ? "Sending Request..." : "Confirm Swap Request"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Marketplace;
