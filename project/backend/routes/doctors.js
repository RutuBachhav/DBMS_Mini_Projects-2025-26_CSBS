const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create Doctor
router.post('/', async (req, res) => {
  console.log('Incoming POST /doctors Payload:', req.body);
  try {
    const { name, specialization, phone, email } = req.body;
    
    const doctorData = {
      name,
      specialization,
      phone,
      email
    };

    const doctor = await prisma.doctor.create({
      data: doctorData
    });
    
    console.log('Successfully Saved Doctor to MySQL:', doctor);
    res.status(201).json(doctor);
  } catch (error) {
    console.error('\n!!! ERROR IN POST /doctors !!!');
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to create doctor' });
  }
});

// Get all Doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(doctors);
  } catch (error) {
    console.error('Error in GET /doctors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    console.error('Error in GET /doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Doctor
router.put('/:id', async (req, res) => {
  console.log(`Incoming PUT /doctors/${req.params.id} Payload:`, req.body);
  try {
    const doctor = await prisma.doctor.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    console.log('Successfully Updated Doctor:', doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Error in PUT /doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Doctor
router.delete('/:id', async (req, res) => {
  try {
    await prisma.doctor.delete({
      where: { id: Number(req.params.id) },
    });
    console.log('Successfully Deleted Doctor ID:', req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
