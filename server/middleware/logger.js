function logger(req, res, next) {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeTakenMs = diff[0] * 1e3 + diff[1] / 1e6;
    console.log(
      `[${new Date().toISOString()}] ${res.statusCode} ${req.method} ${
        req.url
      } - ${timeTakenMs.toFixed(2)} ms`
    );
  });
  next();
}

export { logger };
