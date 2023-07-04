import { Router } from "express";
import { cartManager } from "../dao/fsManagers/CartManager.js";
import { productModel } from "../dao/models/products.model.js";
import { cartModel } from "../dao/models/carts.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const addCart = await cartModel.create(cart);
    res.json({ status: "success", payload: addCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid);
    // Verificar si el producto es válido
    if (!product) {
      return res.status(404).json({ error: "Producto no válido" });
    }
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no válido" });
    }
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    if (existingProductIndex !== -1) {
      // Incrementar la cantidad del producto existente
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Agregar el producto al carrito
      const newProduct = {
        product: pid,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }
    const result = await cart.save();
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    // Obtenemos el Id del carrito
    const cartId = req.params.cid;
    // Obtenemos el producto por ID
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `The cart with id ${cartId} does not exist` });
    }
    // Enviamos el carrito como respuesta si se encuentra
    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
