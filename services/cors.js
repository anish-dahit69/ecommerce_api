export const corsOptions = {
  origin: function (origin, callback) {
    const allowed = process.env.ALLOWED_ORIGINS?.split(",") || [];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
