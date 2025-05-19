const users = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../libs/utils");
const cloudinary = require("../libs/cloudinary.js");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
    console.log("Login Successfully");
    
  } catch (error) {
    console.log("Error in login Controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await users.findOne({ email });

    if (user) return res.status(400).json({ message: " Email Already Exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new users({
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid userdata" });
    }
  } catch (err) {
    console.log(err);

    res.status(401).json(err);
  }
};

exports.editProfile = async (req, res) => {
  console.log("In edit profile");

  try {
    const userId = req.user._id;
    let updateData = { ...req.body };

    // Handle profile picture separately if it's a base64 string
    if (updateData.profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(updateData.profilePic);
      console.log("Cloudinary upload response:", uploadResponse);
      updateData.profilePic = uploadResponse.secure_url;
    }

    // Remove undefined or empty values (optional)
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    const updatedUser = await users.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("Updated user:", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout Controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkAuth = (req, res) => {
  console.log("in check auth backend");
  
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  } 
};
