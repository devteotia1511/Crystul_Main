import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function ConnectFoundersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center space-x-1">
          <img 
            src="/crystul.png" 
            alt="Crystul Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-mono font-bold text-primary">Crystul</span>
        </div>
        <Link href="/" className="text-foreground hover:text-primary transition-colors">
          <Home className="w-6 h-6" />
        </Link>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-primary font-serif">Connect Directly with Startup Founders</h1>
        <p className="max-w-xl text-center text-lg md:text-xl text-muted-foreground mb-8">
          Get first-hand guidance for starting your own venture - straight from experienced startup founders. Book a call, discuss your ideas, and gain valuable insights tailored to your journey.<br/><br/>
          Each founder sets their own rate for their time, so you can choose and book accordingly. After your conversation, if you find their advice fruitful and impactful, you can show your appreciation by giving them a great rating.<br/><br/>
          <span className="font-semibold text-primary">Your startup journey, powered by real-world experience just one call away.</span>
        </p>
        <div className="w-full flex justify-center mb-8">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[250px] h-[250px] object-cover rounded-3xl"
          >
            <source src="/connect.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-center text-md text-muted-foreground">This page is under development. Stay tuned!</p>
      </div>
    </div>
  );
}