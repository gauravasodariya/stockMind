import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    sku: {
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    category: { 
    type: String 
  },
    price: {
      type: Number 
    },
    stock: { 
      type: Number 
    },
    region: { 
      type: String 
    },
    status: { 
      type: String 
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "products");

export default Product;
