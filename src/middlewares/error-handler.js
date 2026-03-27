export function notFoundHandler(_req, res) {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Route not found",
  });
}

export function errorHandler(err, _req, res, _next) {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = status >= 500 ? "Internal server error" : err.message;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    code: status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
    message,
  });
}
