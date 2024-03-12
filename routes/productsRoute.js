const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const { tokenMW, isAdmin } = require("../middlewares/authorizationMW");

router.use(bodyParser.json());

router.post("/", tokenMW, isAdmin, createProduct);

router.get("/", tokenMW, getProducts);

router.get("/:id", tokenMW, getProductById);

router.put("/:id", tokenMW, isAdmin, updateProduct);

router.delete("/:id", tokenMW, isAdmin, deleteProduct);

module.exports = router;
