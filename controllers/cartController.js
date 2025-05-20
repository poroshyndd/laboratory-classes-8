const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Missing product name" });
  }

  const product = await Product.findByName(name);

  if (!product) {
    return res.status(STATUS_CODE.NOT_FOUND).json({ error: "Product not found" });
  }

  try {
    Cart.add(product); 
    res.sendStatus(STATUS_CODE.OK);
  } catch (error) {
    console.error("Error while adding to cart:", error);
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
  }
};

exports.getProductsCount = async () => {
  return await Cart.getProductsQuantity();
};
