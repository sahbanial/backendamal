const jwt = require("jsonwebtoken");

const generate = (payload) =>
  new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, "APP");
      resolve(token);
    } catch (e) {
      reject(e);
    }
  });

const ensure = (token = null) =>
  new Promise((resolve, reject) => {
    if (!token) {
      return reject("token not found");
    }
    try {
      jwt.verify(token, "APP", function (err, payload) {
        if (err) {
          console.log("invalid token");
          return reject("invalid token");
        }
        resolve(payload);
      });
    } catch (err) {
      console.log("token not valid");
    }
  });

module.exports = {
  generate,
  ensure,
};
