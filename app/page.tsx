"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, Target, Star, CheckCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const words = [
    'Dream Team...',
    'Innovation...',
    'Collaboration...',
    'Success...',
    'Startup...'
  ];

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (!isDeleting) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Don't render if already authenticated
  if (status === "authenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Unicorn Logo */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="relative">
                  {/* Unicorn emoji as icon */}
                  <span className="text-2xl">🦄</span>
                  {/* <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" /> */}
                </div>
              </div>
              {/* Floating elements around the icon */}
              {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div> */}
              {/* <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div> */}
            </div>
            <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Unicorn Tank
            </span>
          </div>
          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/ai-assistant">
              <Button variant="ghost" className="font-medium">AI Assistant</Button>
            </Link>
            <Link href="/connect-founders">
              <Button variant="ghost" className="font-medium">Connect with Founders</Button>
            </Link>
            <Link href="/explore">
              <Button variant="ghost" className="font-medium">Explore Teams</Button>
            </Link>
            {/* <Link href="/pricing">
              <Button variant="ghost" className="font-medium">Pricing</Button>
            </Link> */}
            <Link href="/auth/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="font-medium bg-gradient-to-r text-white from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started
              </Button>
            </Link>
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0"><Menu className="h-6 w-6" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/ai-assistant">AI Assistant</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/connect-founders">Connect with Founders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/explore">Explore Teams</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/register">Get Started</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section - Two Columns */}
      <section className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Typewriter Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                  Build Your{' '}
                  <span className="bg-gradient-to-r font-serif from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {currentText}
                  </span>
                  <span className="animate-pulse"></span>
                </h1>
                <p className="text-xl md:text-2xl font-sans text-gray-600 dark:text-gray-300 leading-relaxed">
                  Connect with like-minded entrepreneurs, find your perfect co-founders, and turn your startup ideas into reality with our intelligent matchmaking platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 font-display font-semibold">
                    Start Building <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-display font-medium">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-purple-600">100+</div>
                  <div className="text-sm font-sans text-gray-600 dark:text-gray-300">Entrepreneurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-pink-600">50+</div>
                  <div className="text-sm font-sans text-gray-600 dark:text-gray-300">Teams Formed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-blue-600">10+</div>
                  <div className="text-sm font-sans text-gray-600 dark:text-gray-300">Startups Launched</div>
                </div>
              </div>
            </div>

            {/* Right Column - Tilted Collaboration Image */}
            <div className="flex justify-center items-center">
              <div className="relative">
                {/* Shaking Border Container */}
                <div className="relative animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-sm animate-pulse"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-2">
                    {/* Tilted Image Container */}
                    <div className="transform rotate-12 hover:rotate-0 transition-transform duration-500 ease-in-out">
                      <div className="relative w-full max-w-[22rem] sm:max-w-md md:w-96 md:h-96 aspect-square md:aspect-auto rounded-2xl overflow-hidden shadow-2xl mx-auto">
                        <Image
                          // src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                          src="/coverpage.jpg"
                          alt="Team Collaboration"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-full opacity-80 animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-500 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -right-8 w-8 h-8 bg-blue-500 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Build Together
          </h2>
          <p className="text-lg font-sans text-gray-600 dark:text-gray-300">
            Powerful tools designed specifically for startup teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🦄</span>
              </div>
              <CardTitle className="font-display font-semibold">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Our AI-powered algorithm finds the perfect teammates based on skills, experience, and compatibility.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle className="font-display font-semibold">Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Stay connected with your team through instant messaging, file sharing, and video calls.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="font-display font-semibold">Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Organize tasks, set milestones, and track progress with our intuitive Kanban boards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="font-display font-semibold">Launch Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Create beautiful public profiles to showcase your startup and attract investors.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300 font-sans">Active Entrepreneurs</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-pink-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300 font-sans">Teams Formed</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600 dark:text-gray-300 font-sans">Startups Launched</div>
            </div>
          </div>
        </div>
      </section>


      {/* Funding Partners Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Raise Funding with Our Partners
          </h2>
          <p className="text-lg font-sans text-gray-600 dark:text-gray-300">
            Registered teams can connect with funding partners, pitch, and raise for growth
          </p>
        </div>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/fundraising1.png" alt="Funding discussion" fill className="object-cover" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-serif font-semibold text-gray-900 dark:text-white">
              Discover and Apply to Curated Funding Partners
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-sans">
              As a verified team on Unicorn Tank, you gain access to a curated pool of funding partners
              and accelerators. Share your profile, traction, and goals — our platform helps route your
              pitch to the most relevant partners.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-300 font-sans">
              <li>Create a rich team profile and funding round details</li>
              <li>Get matched with partners aligned to your stage and industry</li>
              <li>Track outreach and communication in one place</li>
            </ul>
          </div>
        </div>

        {/* Row 2 (alternate sides) */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
          <div className="md:order-2 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/fundraising2.png" alt="Pitch deck review" fill className="object-cover" />
          </div>
          <div className="md:order-1 space-y-3">
            <h3 className="text-3xl font-serif font-semibold text-gray-900 dark:text-white">
              Pitch, Get Feedback, and Close Your Round
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-sans">
              Start a conversation directly with partners, share your deck and metrics, and coordinate
              follow-ups from within chat. When it’s a fit, move from intro to diligence seamlessly.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-gray-600 dark:text-gray-300 font-sans">
              <li>Direct messaging with partners</li>
              <li>Share docs and links securely</li>
              <li>Stay organized with a single source of truth</li>
            </ul>
          </div>
        </div>

        {/* Scrolling partner logos */}
        <div className="relative overflow-hidden py-6 border-t border-b border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex items-center gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            <div className="flex items-center gap-12 shrink-0">
              {['Sequoia','Accel','YC','Lightspeed','Andreessen Horowitz','Tiger Global','Matrix','Khosla','Bessemer','General Catalyst'].map((name, idx) => (
                <span key={idx} className="text-gray-500 dark:text-gray-300 font-display text-lg md:text-xl opacity-80 hover:opacity-100 transition">
                  {name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
              {['Sequoia','Accel','YC','Lightspeed','Andreessen Horowitz','Tiger Global','Matrix','Khosla','Bessemer','General Catalyst'].map((name, idx) => (
                <span key={`dup-${idx}`} className="text-gray-500 dark:text-gray-300 font-display text-lg md:text-xl opacity-80 hover:opacity-100 transition">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg font-sans text-gray-600 dark:text-gray-300">
            See how entrepreneurs are building amazing teams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Rohit Taneja",
              title: "CEO, TechFlow",
              content: "Unicorn Tank helped me find the perfect CTO for my SaaS startup. The matching algorithm is incredibly accurate!",
              rating: 5
            },
            {
              name: "Marcus Johnson",
              title: "Founder, EcoCart",
              content: "The collaboration tools are game-changing. We went from idea to MVP in just 3 months.",
              rating: 5
            },
            {
              name: "Priety Thapar",
              title: "Co-founder, HealthSync",
              content: "Found my business partner here and we've already raised our seed round. Highly recommend!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 font-sans">"{testimonial.content}"</p>
                <div>
                  <div className="font-display font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 font-sans">{testimonial.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-purple-100 mb-8 font-sans">
            Join thousands of entrepreneurs who've found their perfect teammates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-50 font-display font-semibold">
                Create Your Profile <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white bg-black text-white hover:bg-white hover:text-purple-600 font-display font-semibold">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">🦄</span>
              </div>
              <span className="text-xl font-mono font-bold">Unicorn Tank</span>
            </div>
            <div className="text-gray-400 font-sans">
              © 2024 Unicorn Tank. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}