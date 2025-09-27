import Product from '../../models/productModel.js';

// ✅ Create a new product....................................................................................................................................................................
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      purchasePrice,
      price,
      sellingPrice,
      stock,
      category,
      sizes,
      colors,
      isFeatured,
      status,
      images = [], // ✅ accept array of image URLs
    } = req.body;

    const product = new Product({
      name,
      description,
      purchasePrice,
      price,
      sellingPrice,
      stock,
      category,
      sizes,
      colors,
      isFeatured,
      status,
      images, // ✅ directly store URLs
    });

    await product.save();
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update a product by ID.............................................................................................................................................................
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      purchasePrice,
      price,
      sellingPrice,
      stock,
      category,
      sizes,
      colors,
      isFeatured,
      status,
      images, // ✅ array of URLs
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updatedProductData = {
      name,
      description,
      purchasePrice,
      price,
      sellingPrice,
      stock,
      category,
      sizes,
      colors,
      isFeatured,
      status,
      images: images || product.images, // ✅ update if new URLs provided
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProductData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete a product by ID..........................................................................................................................................................
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // No Cloudinary delete here ❌ (you can still do it client-side if needed)
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
