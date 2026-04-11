import * as productmodels from "../models/product.models.js";
import { getCache, setCache, deleteCache, clearCachePattern } from "../lib/redis.js";

const CACHE_TTL = 3600; // 1 hour
const PRODUCTS_CACHE_KEY = "products:all";
const PRODUCT_CACHE_KEY_PREFIX = "product:";
const VARIANTS_CACHE_KEY_PREFIX = "product:variants:";
const SIZES_CACHE_KEY_PREFIX = "product:sizes:";

export async function getAllProducts(req, res) {
  try {
    let products = await getCache(PRODUCTS_CACHE_KEY);
    
    if (!products) {
      products = await productmodels.getAllProducts();
      await setCache(PRODUCTS_CACHE_KEY, products, CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${id}`;

    let product = await getCache(cacheKey);
    
    if (!product) {
      product = await productmodels.getProductById(id);
      
      if (product) {
        await setCache(cacheKey, product, CACHE_TTL);
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function createProduct(req, res) {
  try {
    const product = await productmodels.createProduct(req.body);

    await deleteCache(PRODUCTS_CACHE_KEY);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productmodels.updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await deleteCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
    await deleteCache(PRODUCTS_CACHE_KEY);
    await deleteCache(`${VARIANTS_CACHE_KEY_PREFIX}${id}`);
    await deleteCache(`${SIZES_CACHE_KEY_PREFIX}${id}`);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productmodels.deleteProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await deleteCache(`${PRODUCT_CACHE_KEY_PREFIX}${id}`);
    await deleteCache(PRODUCTS_CACHE_KEY);
    await deleteCache(`${VARIANTS_CACHE_KEY_PREFIX}${id}`);
    await deleteCache(`${SIZES_CACHE_KEY_PREFIX}${id}`);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getVariantsByProductId(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = `${VARIANTS_CACHE_KEY_PREFIX}${id}`;

    let variants = await getCache(cacheKey);
    
    if (!variants) {
      variants = await productmodels.getVariantsByProductId(id);
      await setCache(cacheKey, variants, CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: "Variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getSizesByProductId(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = `${SIZES_CACHE_KEY_PREFIX}${id}`;

    let sizes = await getCache(cacheKey);
    
    if (!sizes) {
      sizes = await productmodels.getSizesByProductId(id);
      await setCache(cacheKey, sizes, CACHE_TTL);
    }

    res.status(200).json({
      success: true,
      message: "Sizes fetched successfully",
      data: sizes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}