import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' });

  const fetchData = async () => {
    try {
      const [apptsRes, patsRes, docsRes] = await Promise.all([
        fetch('http://localhost:5000/appointments'),
        fetch('http://localhost:5000/patients'),
        fetch('http://localhost:5000/doctors')
      ]);
      setAppointments(await apptsRes.json());
      setPatients(await patsRes.json());
      setDoctors(await docsRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        patient_id: parseInt(form.patient_id),
        doctor_id: parseInt(form.doctor_id)
      };
      
      console.log('Sending POST request to /appointments with body:', payload);
      
      const res = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Appointment added successfully");
        setForm({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Scheduled' });
        fetchData();
      } else {
        const errorData = await res.json();
        alert("Error scheduling appointment: " + (errorData.error || "Unknown Server Error"));
        console.error("Server Error:", errorData);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      alert("Failed to connect to the backend server. Is it running on port 5000?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Appointments Management</h1>
          <Link href="/" className="text-purple-600 hover:underline">← Back to Dashboard</Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Schedule Appointment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none" value={form.patient_id} onChange={e => setForm({...form, patient_id: e.target.value})} required>
              <option value="">Select Patient</option>
              {patients && patients.length > 0 ? patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>) : ""}
            </select>
            <select className="border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none" value={form.doctor_id} onChange={e => setForm({...form, doctor_id: e.target.value})} required>
              <option value="">Select Doctor</option>
              {doctors && doctors.length > 0 ? doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>) : ""}
            </select>
            <input type="date" className="border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            <input type="time" className="border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
            <select className="border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none md:col-span-2" value={form.status} onChange={e => setForm({...form, status: e.target.value})} required>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button type="submit" className="md:col-span-2 bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition">Schedule Appointment</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Patient</th>
                <th className="p-4 border-b">Doctor</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Time</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? appointments.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{a.id}</td>
                  <td className="p-4">{a.patient?.name || a.patient_id}</td>
                  <td className="p-4">{a.doctor?.name || a.doctor_id}</td>
                  <td className="p-4">{a.date}</td>
                  <td className="p-4">{a.time}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      a.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      a.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
