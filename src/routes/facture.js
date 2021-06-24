const { Router } = require("express");
const fs = require("fs");
const formidable = require("formidable");
const moment = require("moment");
const { USER_ROLE, FACTURE_STATUS } = require("../helper/constants");
const FactureModel = require("../models/Facture");
const { existsSync, readFileSync } = require("fs");
const FactureRouter = Router();
FactureRouter.post("/add", (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const filename = `factures/${Date.now()}.pdf`;
    const path = `uploads/${filename}`;
    const filePath = filename;
    const oldpath = files?.file?.path;

    new FactureModel({
      ...fields,
      amount: parseFloat(fields?.amount),
      receptionDate: moment(fields?.receptionDate).valueOf(),
      file: filePath,
      location: USER_ROLE.ADMINISTRATIVE_DEPARTMENT,
      status: FACTURE_STATUS.PENDING,
    }).save((err, fact) => {
      if (err || !fact) {
        return res.end(
          JSON.stringify({
            err,
          })
        );
      }

      fs.rename(oldpath, path, function (err) {
        if (err) {
          throw err;
        }
      });
      return res.end(
        JSON.stringify({
          success: true,
          data: fact,
        })
      );
    });
  });
});
FactureRouter.post("/edit", (req, res, next) => {
  const body = req.body;
  if (body) {
    const { id, ...rest } = body;
    FactureModel.updateOne(
      { id },
      {
        $set: {
          ...rest,
        },
      }
    ).exec((err, succ) => {});

    res.end(
      JSON.stringify({
        success: true,
      })
    );
  }
});
FactureRouter.get("/", (req, res, next) => {
  FactureModel.find({}).then((factures) => {
    res.status(200).json({
      data: {
        nodes: factures,
        count: factures?.length,
      },
    });
  });
});
FactureRouter.get("/files/factures/:id", (req, res, next) => {
  const { id } = req?.params;
  const path = `./uploads/factures/${id}`;

  if (existsSync(path)) {
    try {
      const data = readFileSync(path);
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.end(data);
    } catch (e) {
      next(e);
    }
  }
});
module.exports = FactureRouter;
