import logger from "../logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.url} - ${err.message}`, {
    stack: err,
  });

  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
