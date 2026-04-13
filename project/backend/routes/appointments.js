const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create Appointment
router.post('/', async (req, res) => {
  console.log('Incoming POST /appointments Payload:', req.body);
  try {
    // 1. Correct mapping from Frontend (camelCase) to Prisma Database (snake_case)
    const pId = req.body.patientId || req.body.patient_id;
    const dId = req.body.doctorId || req.body.doctor_id;
    const { date, time, status } = req.body;

    if (!pId || !dId) {
      console.warn('Missing Foreign Keys for appointment');
      return res.status(400).json({ error: 'patientId and doctorId are required' });
    }

    // 2. Ensuring integer enforcement
    const appointmentData = {
      patient_id: Number(pId),
      doctor_id: Number(dId),
      date: date,
      time: time,
      ...(status && { status })
    };

    console.log('Prepared Appointment for Prisma Insert:', appointmentData);

    const appointment = await prisma.appointment.create({
      data: appointmentData
    });

    console.log('Successfully Saved Appointment to MySQL:', appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('\n!!! ERROR IN POST /appointments !!!');
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to create appointment' });
  }
});

// Get all Appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error in GET /appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        patient: true,
        doctor: true,
      },
    });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    console.error('Error in GET /appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Appointment
router.put('/:id', async (req, res) => {
  console.log(`Incoming PUT /appointments/${req.params.id} Payload:`, req.body);
  try {
    const pId = req.body.patientId || req.body.patient_id;
    const dId = req.body.doctorId || req.body.doctor_id;
    const { date, time, status } = req.body;

    const updateData = {};
    if (pId) updateData.patient_id = Number(pId);
    if (dId) updateData.doctor_id = Number(dId);
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;

    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });
    console.log('Successfully Updated Appointment:', appointment);
    res.json(appointment);
  } catch (error) {
    console.error('Error in PUT /appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Appointment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.appointment.delete({
      where: { id: Number(req.params.id) },
    });
    console.log('Successfully Deleted Appointment ID:', req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
