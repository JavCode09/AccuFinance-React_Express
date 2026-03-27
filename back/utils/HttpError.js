class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;   // HTTP status code
    this.isOperational = true; // opcional, útil para diferenciar errores de sistema vs validación
  }
}

module.exports = HttpError;
