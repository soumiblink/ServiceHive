import { Event } from "../models/event.js";

export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        msg: "Title, Start Time and End Time are required! ",
      });
    }
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        msg: "End time must be after start time!",
      });
    }
    const event = await Event.create({
      title,
      startTime,
      endTime,
      owner: req.user._id,
    });
    res.status(201).json({
      success: true,
      msg: "Event created successfully!",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id }).sort({
      startTime: 1,
    });
    res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, owner: req.user._id });
    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Event not found or unauthorized!",
      });
    }

    // Block deletion if swap is pending
    if (event.status === "SWAP_PENDING") {
      return res.status(400).json({
        success: false,
        msg: "Cannot delete event while swap is pending!",
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      msg: "Event deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const toggleSwap = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, owner: req.user._id });
    if (!event) {
      return res.status(404).json({
        success: false,
        msg: "Event not found or unauthorized!",
      });
    }

    // Prevent toggling while swap is pending
    if (event.status === "SWAP_PENDING") {
      return res.status(400).json({
        success: false,
        msg: "Cannot toggle swappable status while swap is pending!",
      });
    }

    //toggle
    event.status = event.status === "BUSY" ? "SWAPPABLE" : "BUSY";
    await event.save();

    return res.status(200).json({
      success: true,
      msg:
        event.status === "SWAPPABLE"
          ? "Event marked as swappable!"
          : "Event reverted to busy!",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};
