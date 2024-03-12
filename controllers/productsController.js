const { query } = require("express");
const Product = require("../models/productsModel");
const slugify = require("slugify");
const match = require("nodemon/lib/monitor/match");

// Create a product
const createProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ title: req.body.title });
    if (product) {
      return res.status(400).send("Product is already there");
    }
    req.body.slug = slugify(req.body.title);
    product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).send("Product not added");
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    const query = await Product.find(queryStr);

    // Sorting

    res.status(200).send(query);
  } catch (err) {
    res.status(400).send("Can't get products");
  }
};

// Get a product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).send("Product not found");
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send("Product not found");
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product deleted");
  } catch (err) {
    res.status(400).send("Product not deleted");
  }
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
