import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function ConnectFoundersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <span className="flex items-center space-x-2 text-2xl font-mono font-bold">
          <span>Unicorn Tank</span>
        </span>
        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <Home className="w-7 h-7" />
        </Link>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 font-serif bg-clip-text text-transparent">Connect Directly with Startup Founders</h1>
        <p className="max-w-xl text-center text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8">
          Get first-hand guidance for starting your own venture - straight from experienced startup founders. Book a call, discuss your ideas, and gain valuable insights tailored to your journey.<br/><br/>
          Each founder sets their own rate for their time, so you can choose and book accordingly. After your conversation, if you find their advice fruitful and impactful, you can show your appreciation by giving them a great rating.<br/><br/>
          <span className="font-semibold">Your startup journey, powered by real-world experience - just one call away.</span>
        </p>
        <div className="w-full flex justify-center mb-8">
          <span className="text-6xl animate-bounce">📞</span>
        </div>
        <p className="text-center text-md text-gray-500 dark:text-gray-400">This page is under development. Stay tuned!</p>
      </div>
    </div>
  );
}