import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function AiAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <span className='text-2xl font-mono font-bold'> 
          Unicorn Tank
        </span>
        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <Home className="w-7 h-7" />
        </Link>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Assistant - Coming Soon!</h1>
        <p className="max-w-xl text-center text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8">
          Our upcoming AI-powered assistant will help you get answers to all your questions - from starting your dream startup, creating the perfect team, understanding required documents, planning workflows, estimating budgets, and much more!<br/><br/>
          <span className="font-semibold">Right now, this feature is still in the works 🛠️<br/>Stay tuned as we build something amazing for you.</span>
        </p>
        <div className="w-full flex justify-center mb-8">
          <img src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif" alt="Unicorn running" className="w-80 h-48 object-contain mx-auto animate-pulse" />
        </div>
        <p className="text-center text-md text-gray-500 dark:text-gray-400">(Meanwhile, enjoy this unicorn sprinting towards the future)</p>
      </div>
    </div>
  );
}