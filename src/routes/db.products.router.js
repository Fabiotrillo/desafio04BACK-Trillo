import { Router } from 'express';
import productModel from '../dao/db/models/products.model.js';

const router = Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productModel.find();
    res.send({ products });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Obtener un producto por ID
//http://localhost:8080/db/products/"ID"
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    res.send({ product });
  } catch (error) {
    console.error("Error al obtener producto por ID:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, stock, code, price } = req.body;
    
    if (!title || !description || !stock || !code || !price) {
      return res.status(400).send({ error: "Valores incompletos" });
    }

    const product = {
      title,
      description,
      stock,
      code,
      price
    };

    const result = await productModel.create(product);
    res.status(201).send({ result });
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, stock, code, price } = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { title, description, stock, code, price },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedProduct) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    res.send({ updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    res.send({ deletedProduct });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

export { router as dbProductRouter };