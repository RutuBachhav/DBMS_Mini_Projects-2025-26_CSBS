const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create Patient
router.post('/', async (req, res) => {
  console.log('Incoming POST /patients Payload:', req.body);
  try {
    const { name, age, gender, phone, email } = req.body;
    
    // Explicit object mapping to prevent any type mismatches with Prisma Schema
    const patientData = {
      name: name,
      age: Number(age), // Force Integer
      gender: gender,
      phone: phone,
      email: email
    };

    const patient = await prisma.patient.create({
      data: patientData
    });

    console.log('Successfully Saved Patient to MySQL:', patient);
    res.status(201).json(patient);
  } catch (error) {
    console.error('\n!!! ERROR IN POST /patients !!!');
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to create patient' });
  }
});

// Get all Patients
router.get('/', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.json(patients);
  } catch (error) {
    console.error('Error in GET /patients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    console.error('Error in GET /patients/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Patient
router.put('/:id', async (req, res) => {
  console.log(`Incoming PUT /patients/${req.params.id} Payload:`, req.body);
  try {
    const { name, age, gender, phone, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = Number(age);
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const patient = await prisma.patient.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });
    console.log('Successfully Updated Patient:', patient);
    res.json(patient);
  } catch (error) {
    console.error('Error in PUT /patients/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Patient
router.delete('/:id', async (req, res) => {
  try {
    await prisma.patient.delete({
      where: { id: Number(req.params.id) },
    });
    console.log('Successfully Deleted Patient ID:', req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /patients/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
