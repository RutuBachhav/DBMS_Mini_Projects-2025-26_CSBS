import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '', email: '' });

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5000/patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        age: parseInt(form.age)
      };
      
      console.log('Sending POST request to /patients with body:', payload);
      
      const res = await fetch('http://localhost:5000/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Patient added successfully");
        setForm({ name: '', age: '', gender: '', phone: '', email: '' });
        fetchPatients();
      } else {
        const errorData = await res.json();
        alert("Error adding patient: " + (errorData.error || "Unknown Server Error"));
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
          <h1 className="text-3xl font-bold text-gray-800">Patients Management</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Patient</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="number" placeholder="Age" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
            <select className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" placeholder="Phone" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            <input type="email" placeholder="Email" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none md:col-span-2" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition">Add Patient</button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Age</th>
                <th className="p-4 border-b">Gender</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {patients && patients.length > 0 ? patients.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{p.id}</td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.age}</td>
                  <td className="p-4">{p.gender}</td>
                  <td className="p-4">{p.phone}</td>
                  <td className="p-4">{p.email}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
