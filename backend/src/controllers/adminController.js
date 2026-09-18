import User from "../models/User.js";
import Report from "../models/Report.js";
import Interaction from "../models/Interaction.js";
import Match from "../models/Match.js";

/* =========================
   ADMIN DASHBOARD
========================= */

export async function dashboard(_req, res) {
  try {
    const [users, active, reports, matches, likes] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({
        role: "USER",
        status: "ACTIVE",
      }),
      Report.countDocuments({ status: "OPEN" }),
      Match.countDocuments({ active: true }),
      Interaction.countDocuments({ type: "LIKE" }),
    ]);

    res.json({
      users,
      active,
      openReports: reports,
      matches,
      likes,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
}


/* =========================
   ADMIN USERS
========================= */

export async function users(req, res) {
  try {
    const {
      q = "",
      status = "ALL",
      identity = "ALL",
      verified = "ALL",
      sort = "newest",
    } = req.query;

    const filter = {
      role: "USER",
    };


    /* SEARCH */

    if (q.trim()) {
      const search = q.trim();

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }


    /* STATUS */

    if (
      ["ACTIVE", "SUSPENDED", "DELETED"].includes(status)
    ) {
      filter.status = status;
    }


    /* IDENTITY */

    if (
      [
        "MAN",
        "WOMAN",
        "NON_BINARY",
        "OTHER",
        "PREFER_NOT_TO_SAY",
      ].includes(identity)
    ) {
      filter.identity = identity;
    }


    /* EMAIL VERIFICATION */

    if (verified === "VERIFIED") {
      filter.emailVerified = true;
    }

    if (verified === "UNVERIFIED") {
      filter.emailVerified = false;
    }


    /* SORT */

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "name_asc":
        sortOption = {
          name: 1,
        };
        break;

      case "name_desc":
        sortOption = {
          name: -1,
        };
        break;

      case "active_recent":
        sortOption = {
          lastActiveAt: -1,
        };
        break;

      case "active_old":
        sortOption = {
          lastActiveAt: 1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }


    /* GET USERS */

    const list = await User.find(filter)
      .select("-passwordHash")
      .sort(sortOption)
      .limit(500)
      .lean();


    const total = await User.countDocuments(filter);


    res.json({
      users: list,
      total,
      filters: {
        q,
        status,
        identity,
        verified,
        sort,
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);

    res.status(500).json({
      message: "Failed to load users",
    });
  }
}


/* =========================
   ADMIN REPORTS
========================= */

export async function reports(_req, res) {
  try {
    const list = await Report.find()
      .populate(
        "reporter",
        "name email"
      )
      .populate(
        "reported",
        "name email status"
      )
      .sort({
        createdAt: -1,
      })
      .limit(500);

    res.json({
      reports: list,
    });
  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      message: "Failed to load reports",
    });
  }
}


/* =========================
   CHANGE USER STATUS
========================= */

export async function setUserStatus(req, res) {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "ACTIVE",
      "SUSPENDED",
      "DELETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }


    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "USER",
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-passwordHash")
      .lean();


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    res.json({
      message: `User status changed to ${status}`,
      user,
    });
  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update user status",
    });
  }
}