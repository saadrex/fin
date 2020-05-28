var express = require("express");
var router = express.Router();

const {
  loadDataEvent,
  getPopulationNumber,
  getReseauBancaireNumber,
  getIobNumber,
  getGabNumber,
  loadListPins,
} = require("../services/xlxs.service");
const path = require("path");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("public/index.html", { root: __dirname });
});

router.get("/xlxs/loadData", async (req, res) => {
  const { link } = req.query;
  try {
    const t = await loadDataEvent("public/" + link);

    res.json(t);
  } catch (e) {
    console.error(e);
  }
});

router.get("/xlxs/listPins", async (req, res) => {
  try {
    const t = await loadListPins();

    res.json(t);
  } catch (e) {
    console.error(e);
  }
});

router.get("/xlxs/popAdulte", async (req, res) => {
  let link =
    "public/data/Specification_Poc_Cartographie_InclusionFinanciere.xlsx";

  try {
    const data = await getPopulationNumber(link);

    res.json({ data });
  } catch (e) {
    console.error(e);
    res.header(400).json({ data: "error" });
  }
});

router.get("/xlxs/resBancaire", async (req, res) => {
  try {
    const data = await getReseauBancaireNumber();

    res.json({ data });
  } catch (e) {
    console.error(e);
  }
});

router.get("/xlxs/iob", async (req, res) => {
  try {
    const data = await getIobNumber();

    res.json({ data });
  } catch (e) {
    console.error(e);
  }
});

router.get("/xlxs/gab", async (req, res) => {
  try {
    const data = await getGabNumber();

    res.json({ data });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
