import { Router } from 'express';
import cartModel from '../dao/db/models/carts.model.js';

const router = Router();

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.send({ carts });
  } catch (error) {
    console.error("Error al obtener carritos:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Obtener un carrito por ID
router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartModel.findById(cartId);
    
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.send({ cart });
  } catch (error) {
    console.error("Error al obtener carrito por ID:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const { user, products, total } = req.body;
    
    if (!user || !products || !total) {
      return res.status(400).send({ error: "Valores incompletos" });
    }

    const cart = {
      user,
      products,
      total
    };

    const result = await cartModel.create(cart);
    res.status(201).send({ result });
  } catch (error) {
    console.error("Error al crear el carrito:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Actualizar un carrito por ID
router.put('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { user, products, total } = req.body;

    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { user, products, total },
      { new: true } 
    );

    if (!updatedCart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.send({ updatedCart });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Eliminar un carrito por ID
router.delete('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const deletedCart = await cartModel.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.send({ deletedCart });
  } catch (error) {
    console.error("Error al eliminar el carrito:", error.message);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

export { router as dbCartRouter };