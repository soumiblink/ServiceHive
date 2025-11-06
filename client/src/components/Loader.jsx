import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
      sx={{ backgroundColor: "#f9fafb" }}
    >
      <CircularProgress sx={{ color: "#466cf2ff 0%, #09d2f1ff 100%" }} />
      <Typography variant="body2" color="text.secondary">
        Please wait...
      </Typography>
    </Box>
  );
};

export default Loader;
