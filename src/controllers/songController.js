import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // Upload the audio file first
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    // Calculate the duration after the audio has been uploaded
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

    // Upload the image file
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Prepare song data
    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    // Save song data to the database
    const song = new songModel(songData);
    await song.save();

    res.json({ success: true, message: "Song Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding song" });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await songModel.find({});
    res.json({ success: true, songs: allSongs });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeSong = async (req, res) => {
  try {
    await songModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Song Removed" });
  } catch (error) {
    res.json({ success: false });
  }
};

export { addSong, listSong, removeSong };
