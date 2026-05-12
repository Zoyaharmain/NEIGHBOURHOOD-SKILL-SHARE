import Skill from "../models/skill.models.js";
import Session from "../models/session.models.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

   const skillsCount = await Skill.countDocuments({
       mentor: userId
    });

    const sessionsCount = await Session.countDocuments({
      $or: [
        { learner: userId },
        { mentor: userId }
      ]
    });

    const pendingCount = await Session.countDocuments({
      $or: [
        { learner: userId },
        { mentor: userId }
      ],
      status: "Pending"
    });

    res.status(200).json({
      success: true,
      data: {
        skillsCount,
        sessionsCount,
        pendingCount
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard"
    });
  }
};