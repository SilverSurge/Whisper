// imports
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// registeration logic
export const register = async (req, res) => {
  try {
    // get all the attributes
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // all the fields are necessary
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "all the fields are required" });
    }

    // passwords should match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passord and confirm password don't match" });
    }

    // check if username already exists
    const user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ message: "username already used" });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // profilePhoto
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // create a user
    await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });

    // return success
    return res.status(201).json({
      message: "account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// login logic
export const login = async (req, res) => {
  try {
    // get the attributes
    const { username, password } = req.body;

    // all fields are necessary
    if (!username || !password) {
      return res.status(400).json({ message: "all the fields are required" });
    }

    // find user in database
    const user = await User.findOne({ username });

    // if username doesn't exist
    if (!user) {
      return res.status(400).json({ message: "incorrect username or password", success: false });
    }

    // verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // password don't match
    if (!isPasswordMatch)
      return res
        .status(400)
        .json({ message: "incorrect username or password", success: false });

    // create a token
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // set the token in cookie
    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
      });

  } catch (error) {
    console.log(error);
  }
};

// logout logic
export const logout = (req, res) => {
  try {
    // remove the token from cookie
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
    });

  } catch (error) {
    console.log(error);
  }
};

// get other users logic
export const getOtherUsers = async (req, res) => {
  try {
    // get the user id
    const loggedInUserId = req.id;  // from authentication middleware

    // retrieve all the users, don't get the password field
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    // return the list of users
    return res.status(200).json(otherUsers);
  } catch (error) {
    console.log(error);
  }
};
