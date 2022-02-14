class Request {
  constructor({ signature, publicKey, message }) {
    this.signature = signature;
    this.publicKey = publicKey;
    this.message = message;
  }
}

class Response {
  constructor(success, message, roles = null) {
    this.success = success;
    this.message = message;
    this.roles = roles;
  }
}

module.exports = { Request, Response };
