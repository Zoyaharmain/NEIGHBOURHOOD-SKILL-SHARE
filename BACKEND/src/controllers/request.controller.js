import Request from "../models/request.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createRequest = asyncHandler(async (req, res) => {

  const { title, description, category, mode, location } = req.body;

  const request = await Request.create({
    user: req.user._id,
    title,
    description,
    category,
    mode,
    location
  });

  res.status(201).json({
    success: true,
    request
  });
});


export const getRequests = asyncHandler(async (req, res) => {

  const requests = await Request.find({
    user: { $ne: req.user._id }
  }).populate("user", "username location");

  res.json(requests);
});


export const getMyRequests = asyncHandler(async (req, res) => {

  const requests = await Request.find({
    user: req.user._id
  });

  res.json(requests);
});