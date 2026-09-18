import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isAdult } from "../utils/age.js";


/* =========================
   CREATE JWT TOKEN
========================= */

function token(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}


/* =========================
   SAFE USER RESPONSE
========================= */

const safe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,

  dob: user.dob,

  identity: user.identity,
  interestedIn: user.interestedIn,
  lookingFor: user.lookingFor,
  datingIntent: user.datingIntent,

  bio: user.bio,
  photos: user.photos,

  city: user.city,
  interests: user.interests,

  minAge: user.minAge,
  maxAge: user.maxAge,
  maxDistanceKm: user.maxDistanceKm,

  role: user.role,
  status: user.status,
  emailVerified: user.emailVerified,
});


/* =========================
   REGISTER
========================= */

export async function register(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
      dob,
      identity,
      interestedIn,
      lookingFor,
      datingIntent,
    } = req.body;


    /* REQUIRED FIELDS */

    if (
      !name ||
      !email ||
      !password ||
      !dob ||
      !identity ||
      !interestedIn?.length ||
      !lookingFor?.length
    ) {
      return res.status(400).json({
        message: "Please complete all required fields",
      });
    }


    /* AGE */

    if (!isAdult(dob)) {
      return res.status(400).json({
        message: "WILD is for adults 18+ only",
      });
    }


    /* PASSWORD */

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
    }


    /* EMAIL */

    const normalizedEmail =
      email.trim().toLowerCase();

    const exists = await User.findOne({
      email: normalizedEmail,
    });

    if (exists) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }


    /* PASSWORD HASH */

    const passwordHash = await bcrypt.hash(
      password,
      12
    );


    /* CREATE USER */

    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      phone: phone?.trim() || "",

      passwordHash,

      dob,

      identity,

      interestedIn,

      lookingFor,

      datingIntent: datingIntent || [],
    });


    res.status(201).json({
      token: token(user),
      user: safe(user),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
}


/* =========================
   LOGIN
========================= */

export async function login(req, res) {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");


    /* INVALID LOGIN */

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.passwordHash
      ))
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    /* =========================
       ACCOUNT STATUS
    ========================= */

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account is not active now",
        status: user.status,
      });
    }


    /* LAST ACTIVE */

    user.lastActiveAt = new Date();

    await user.save();


    res.json({
      token: token(user),
      user: safe(user),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
}


/* =========================
   CURRENT USER
========================= */

export async function me(req, res) {
  res.json({
    user: safe(req.user),
  });
}