const cors = (req, res, next) => {
    
  const allowedOrigins = JSON.parse(process.env.CORS_ORIGINS || "[]");
  const origin = req.headers.origin;

  console.log({origin: req.headers.origin, allowedOrigins});
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};

export default cors;