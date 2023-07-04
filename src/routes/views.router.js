import { Router } from "express";
import { productModel } from "../dao/models/products.model.js";
import { messageModel } from "../dao/models/messages.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allProducts = await productModel.find().lean().exec();
    console.log(allProducts.map((prod) => prod._id));
    res.render("home", { allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    const allProducts = await productModel.find().lean().exec();
    res.render("realTimeProducts", { allProducts: allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
