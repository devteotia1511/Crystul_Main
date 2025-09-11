import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2 group">
      <img 
        src="/crystul.png" 
        alt="Crystul Logo" 
        className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300"
      />
      <span className="text-xl font-display font-bold text-primary group-hover:text-primary/80 transition-all duration-300">
        Crystul
      </span>
    </Link>
  );
}
