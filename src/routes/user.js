const { Router } = require("express");
const UserModel = require("../models/User");
const Token = require("../helper/token");
const UserRouter = Router();
UserRouter.post("/login", (req, res, next) => {
  const body = req.body;
  UserModel.findOne({ email: body?.email }).then((user) => {
    if (!user)
      res.end(
        JSON.stringify({
          error: "Mot de passe ou email incorrect",
          success: false,
          token: null,
        })
      );
    if (!user.isValidPassword(body?.password)) {
      return res.end(
        JSON.stringify(
          { success: false, error: "Mot de passe ou email incorrect" },
          null,
          5
        )
      );
    }
    if (user) {
      Token.generate({
        id: user.id,
        role: user?.role,
        userName: user?.userName,
      })
        .then((token) => {
          return res.end(
            JSON.stringify({ success: true, token, user }, null, 5)
          );
        })
        .catch((err) => next(err));
    }
  });
});
UserRouter.post("/add", (req, res, next) => {
  const body = req.body;
  console.log({ body });
  new UserModel({
    ...body,
  }).save((err, user) => {
    console.log({ err, user });
    if (err || !user) {
      return res.end(
        JSON.stringify({
          err,
        })
      );
    }
    if (user) {
      return res.end(
        JSON.stringify({
          user,
        })
      );
    }
  });
});
UserRouter.put("/edit", (req, res, next) => {});
UserRouter.delete("/:id", (req, res, next) => {});
module.exports = UserRouter;
