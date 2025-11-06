// utils/features.js

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "numeric",
  });
};

export const formatMonth = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
  });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getDuration = (startString, endString) => {
  const start = new Date(startString);
  const end = new Date(endString);
  const diff = (end - start) / (1000 * 60);
  if (diff < 60) return `${diff} min`;
  if (diff === 60) return "1 hr";
  return `${Math.floor(diff / 60)} hr ${diff % 60} min`;
};

export const getStatusConfig = (status) => {
  const configs = {
    BUSY: {
      color: "#6b7280",
      bgColor: "rgba(107, 114, 128, 0.1)",
      label: "Busy",
      icon: "🔴",
    },
    SWAPPABLE: {
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)",
      label: "Available for Swap",
      icon: "🟢",
    },
    SWAP_PENDING: {
      color: "#d97706",
      bgColor: "rgba(217, 119, 6, 0.1)",
      label: "Swap Pending",
      icon: "🟡",
    },
  };
  return configs[status] || configs.BUSY;
};

export const getTypeColor = (type) => {
  const colors = {
    Meeting: "primary",
    Review: "secondary",
    Workshop: "success",
    Presentation: "warning",
    "Quick Chat": "info",
  };
  return colors[type] || "default";
};
