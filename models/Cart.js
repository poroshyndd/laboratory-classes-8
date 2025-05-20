const Product = require("./Product");
const { getDatabase } = require("../database");

const COLLECTION_NAME = "carts";

class Cart {
  constructor() {}

  static async getCart() {
    const db = getDatabase();

    try {
      let cart = await db.collection(COLLECTION_NAME).findOne({});

      if (!cart) {
        await db.collection(COLLECTION_NAME).insertOne({ items: [] });
        cart = { items: [] };
      }

      return cart;
    } catch (error) {
      console.error("Error occurred while searching cart");
      return { items: [] };
    }
  }

  static async add(product) {
    const db = getDatabase();

    if (!product || !product.name || !product.price) {
      console.error("Invalid product object");
      return;
    }

    try {
      const cart = await this.getCart();
      const found = cart.items.find(item => item.product.name === product.name);

      if (found) {
        found.quantity += 1;
      } else {
        cart.items.push({ product, quantity: 1 });
      }

      await db.collection(COLLECTION_NAME).updateOne({}, { $set: { items: cart.items } });
    } catch (error) {
      console.error("Error occurred while adding product to cart:", error);
    }
  }

  static async getItems() {
    try {
      const cart = await this.getCart();
      return cart.items;
    } catch (error) {
      console.error("Error occurred while searching for products in cart");
      return [];
    }
  }

  static async getProductsQuantity() {
    try {
      const cart = await this.getCart();
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error occurred while getting quantity of items in cart");
      return 0;
    }
  }

  static async getTotalPrice() {
    try {
      const cart = await this.getCart();
      return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    } catch (error) {
      console.error("Error occurred while calculating total price");
      return 0;
    }
  }

  static async clearCart() {
    const db = getDatabase();

    try {
      await db.collection(COLLECTION_NAME).updateOne({}, { $set: { items: [] } });
    } catch (error) {
      console.error("Error occurred while clearing cart");
    }
  }

  static async deleteProductByName(productName) {
    const db = getDatabase();

    try {
      const cart = await this.getCart();
      const updatedItems = cart.items.filter(item => item.product.name !== productName);

      await db.collection(COLLECTION_NAME).updateOne({}, { $set: { items: updatedItems } });
    } catch (error) {
      console.error("Error occurred while deleting product from cart");
    }
  }
}

module.exports = Cart;
