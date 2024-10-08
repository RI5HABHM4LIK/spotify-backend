import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

// Add a new album
const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file; // Use req.file for single file upload

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    // Upload the image file to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Prepare album data
    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    // Save album data to the database
    const album = new albumModel(albumData);
    await album.save();

    res.json({ success: true, message: "Album added" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ success: false, message: "Error adding album" });
  }
};

// List all albums
const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving albums" });
  }
};

// Remove an album
const removeAlbum = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "No album ID provided" });
    }

    await albumModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Album removed" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ success: false, message: "Error removing album" });
  }
};

export { addAlbum, listAlbum, removeAlbum };
