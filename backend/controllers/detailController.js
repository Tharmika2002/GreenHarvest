import mongoose from "mongoose";
import detailModel from "../models/detailModel.js";

// ✅ Create a new detail
export const createDetail = async (req, res) => {
  const {
    workDistrict,
    location,
    expectedDateToFinish,
    email,
    additionalInformation,
    isChecked,
    days,
    hours,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  try {
    const imagePath = `/uploads/${req.file.filename}`;

    const newDetail = new detailModel({
      workDistrict,
      location,
      email,
      expectedDateToFinish,
      additionalInformation,
      isChecked,
      days,
      hours,
      image: imagePath,
    });

    await newDetail.save();

    res.status(201).json({
      success: true,
      message: "Detail created successfully",
      data: newDetail,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all details
export const getDetails = async (req, res) => {
  try {
    const details = await detailModel.find();
    res.status(200).json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single detail by ID
export const getSingleDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  try {
    const detail = await detailModel.findById(id);
    if (!detail) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update detail by ID
export const updateDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedDetail = await detailModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDetail) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, message: "Detail updated", data: updatedDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete detail by ID
export const deleteDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  try {
    const deleted = await detailModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, message: "Detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

