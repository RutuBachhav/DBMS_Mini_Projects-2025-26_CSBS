import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '', phone: '', email: '' });

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5000/doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending POST request to /doctors with body:', form);
      
      const res = await fetch('http://localhost:5000/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Doctor added successfully");
        setForm({ name: '', specialization: '', phone: '', email: '' });
        fetchDoctors();
      } else {
        const errorData = await res.json();
        alert("Error adding doctor: " + (errorData.error || "Unknown Server Error"));
        console.error("Server Error:", errorData);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      alert("Failed to connect to the backend server. Is it running on port 5000?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Doctors Management</h1>
          <Link href="/" className="text-green-600 hover:underline">← Back to Dashboard</Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Doctor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" className="border p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="text" placeholder="Specialization" className="border p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} required />
            <input type="text" placeholder="Phone" className="border p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            <input type="email" placeholder="Email" className="border p-2 rounded focus:ring-2 focus:ring-green-400 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition">Add Doctor</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Specialization</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.length > 0 ? doctors.map(d => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{d.id}</td>
                  <td className="p-4 font-medium">{d.name}</td>
                  <td className="p-4">{d.specialization}</td>
                  <td className="p-4">{d.phone}</td>
                  <td className="p-4">{d.email}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No doctors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
