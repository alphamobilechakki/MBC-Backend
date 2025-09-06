import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    // Pricing
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Original price (MRP) is required"],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: 0,
    },

    // Inventory
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: [String],  // ["S","M","L","XL"]
    colors: [String], // ["Red","Blue","Black"]

    // Images (Cloudinary )
     images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    // ✅ integrate reviews
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    
    // Other flags
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
