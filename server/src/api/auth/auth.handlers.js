import { createUser, getUserByEmail, getUserEmail } from "./auth.services.js";
import { capitalize } from "../../utils/helpers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleSignUp = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const emails = await getUserEmail(email);

    if (emails.length) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await createUser(
      capitalize(firstname),
      capitalize(lastname),
      email,
      hashedPassword
    );

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};

export const handleSignIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const result = await getUserByEmail(email);

    if (!result) {
      return res.status(400).json({
        success: false,
        error: "email",
        message: "No user found",
      });
    }

    if (!(await bcrypt.compare(password, result.password))) {
      return res.status(400).json({
        success: false,
        error: "password",
        message: "Wrong password",
      });
    }

    const user = {
      user_id: result.user_id,
      user: `${result.firstname} ${result.lastname}`,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

    return res
      .status(200)
      .cookie("access_token", token, { sameSite: "None", secure: true })
      .json({
        success: true,
        message: "Signed in successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error " + error,
    });
  }
};
