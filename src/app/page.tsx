import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-[2rem] bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 animate-in fade-in zoom-in duration-500">
        <span className="text-5xl text-white">🍔</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
        Digital School <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Canteen</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
        Effortlessly manage your students' snack orders. Track spending, view detailed order history, and handle everything seamlessly with a modern interface.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/snacks"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-orange-200 hover:-translate-y-1 w-full sm:w-auto text-lg"
        >
          View Snacks Menu
        </Link>
        <Link
          href="/students"
          className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 font-semibold py-4 px-8 rounded-2xl transition-all shadow-sm hover:border-gray-200 hover:-translate-y-1 w-full sm:w-auto text-lg"
        >
          Manage Students
        </Link>
      </div>
    </div>
  );
}
