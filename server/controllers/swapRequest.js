import { Event } from "../models/event.js";
import { SwapRequest } from "../models/swapRequest.js";

export const getSwappableSlots = async (req, res) => {
  try {
    const userId = req.user._id;

    const slots = await Event.find({
      status: "SWAPPABLE",
      owner: { $ne: userId },
    })
      .populate("owner", "name email")
      .sort({ startTime: 1 });

    if (slots.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "No swappable slots available at the moment.",
        slots: [],
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Swappable slots fetched successfully!",
      count: slots.length,
      slots,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const createSwapRequest = async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({
        success: false,
        msg: "Both mySlotId and theirSlotId are required!",
      });
    }
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({
        success: false,
        msg: "One or both slots not found!",
      });
    }

    //ensure you offer your slot and not someone else's
    if (mySlot.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You can only offer your own slot for swapping!",
      });
    }

    //ensure you dont swap with your own slot
    if (theirSlot.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        msg: "You cannot swap with your own slot!",
      });
    }

    //ensure both slots are swappable
    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
      return res.status(400).json({
        success: false,
        msg: "Both slots must be in SWAPPABLE status!",
      });
    }

    const swap = await SwapRequest.create({
      requester: req.user._id,
      receiver: theirSlot.owner,
      requesterSlot: mySlotId,
      receiverSlot: theirSlotId,
      status: "PENDING",
    });

    // Update both events/slots to SWAP_PENDING
    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    return res.status(201).json({
      success: true,
      msg: "Swap request created successfully!",
      swap,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const respondToSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accepted } = req.body;

    const userId = req.user._id;

    const swap = await SwapRequest.findById(requestId)
      .populate("requesterSlot")
      .populate("receiverSlot");

    if (!swap) {
      return res.status(404).json({
        success: false,
        msg: "Swap request not found!",
      });
    }

    //ensure logged in user is receiver
    if (swap.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to respond to this swap!",
      });
    }

    const requesterSlot = swap.requesterSlot;
    const receiverSlot = swap.receiverSlot;

    //handle duplicate response
    if (swap.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        msg: "This swap request has already been processed!",
      });
    }

    //handle if accepted/rejected
    if (accepted) {
      // swap ownerships
      const tempOwner = requesterSlot.owner;
      requesterSlot.owner = receiverSlot.owner;
      receiverSlot.owner = tempOwner;

      requesterSlot.status = "BUSY";
      receiverSlot.status = "BUSY";
      swap.status = "ACCEPTED";

      await requesterSlot.save();
      await receiverSlot.save();
      await swap.save();

      return res.status(200).json({
        success: true,
        msg: "Swap accepted successfully! Ownership exchanged.",
        swap,
      });
    } else {
      requesterSlot.status = "SWAPPABLE";
      receiverSlot.status = "SWAPPABLE";
      swap.status = "REJECTED";

      await requesterSlot.save();
      await receiverSlot.save();
      await swap.save();

      return res.status(200).json({
        success: true,
        msg: "Swap request rejected successfully.",
        swap,
      });
    }
  } catch (err) {
    console.error("Error in respondToSwapRequest:", err);
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};

export const getMySwapRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all requests where user is receiver (incoming)
    const incoming = await SwapRequest.find({
      receiver: userId,
      status: "PENDING",
    })
      .populate("requester", "name email")
      .populate("requesterSlot", "title startTime endTime status")
      .populate("receiverSlot", "title startTime endTime status")
      .sort({ createdAt: -1 });

    // Fetch all requests where user is requester (outgoing)
    const outgoing = await SwapRequest.find({ requester: userId })
      .populate("receiver", "name email")
      .populate("requesterSlot", "title startTime endTime status")
      .populate("receiverSlot", "title startTime endTime status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      msg: "Swap requests fetched successfully!",
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
      incoming,
      outgoing,
    });
  } catch (err) {
    console.error("Error fetching swap requests:", err);
    return res.status(500).json({
      success: false,
      msg: err.message || "Internal Server Error!",
    });
  }
};
