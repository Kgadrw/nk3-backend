const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');

// Get all payment methods
router.get('/', async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find().sort({ createdAt: -1 });
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single payment method
router.get('/:id', async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment method
router.post('/', async (req, res) => {
  try {
    const paymentMethod = new PaymentMethod(req.body);
    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update payment method
router.put('/:id', async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(paymentMethod);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete payment method
router.delete('/:id', async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

