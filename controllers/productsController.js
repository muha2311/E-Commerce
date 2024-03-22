const Product = require("../models/productsModel");
const slugify = require("slugify");

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
    // Filtering -->> price[gte]=100 in the url request

    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    let query = Product.find(queryStr);

    // Sorting -->> sort=category,desc  ===== default is ascending

    let page = parseInt(req.query.page) - 1 || 0;
    let limit = parseInt(req.query.limit) || 5;
    let sort = req.query.sort || "createdAt";

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};

    if (sort[1]) {
      sortBy[sort[0]] = sort[1] === "desc" ? -1 : 1;
    } else {
      sortBy[sort[0]] = 1;
    }

    // Limiting Fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query.select("-__v");
    }

    let product = await query
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const response = {
      page: page + 1,
      limit: limit,
      product,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
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
