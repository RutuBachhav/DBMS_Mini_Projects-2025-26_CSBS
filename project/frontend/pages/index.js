import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6 border-b pb-4">Medical Information Management System</h1>
        <p className="text-gray-600 mb-8">Manage your hospital's patients, doctors, and appointments seamlessly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/patients" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-4 px-6 rounded-xl transition duration-300 shadow-sm flex flex-col items-center">
            <span className="text-2xl mb-2">🧑‍🦱</span>
            Patients
          </Link>
          <Link href="/doctors" className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-4 px-6 rounded-xl transition duration-300 shadow-sm flex flex-col items-center">
            <span className="text-2xl mb-2">🩺</span>
            Doctors
          </Link>
          <Link href="/appointments" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-4 px-6 rounded-xl transition duration-300 shadow-sm flex flex-col items-center">
            <span className="text-2xl mb-2">📅</span>
            Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}
