"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Target, Star, CheckCircle, Menu } from 'lucide-react';
import Link from 'next/link';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const words = [
    'Dream Team',
    'Innovation',
    'Collaboration',
    'Success',
    'Startup'
  ];

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Scroll effect for dynamic header
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (!isDeleting) {
      // Typing out the word
      if (currentText.length < currentWord.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 150);
        return () => clearTimeout(timer);
      } else {
        // Word is complete, wait then start deleting
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // Deleting the word
      if (currentText.length > 0) {
          const timer = setTimeout(() => {
            setCurrentText(currentText.slice(0, -1));
        }, 100);
          return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Reset text when word changes
  useEffect(() => {
    setCurrentText('');
  }, [currentWordIndex]);

  // Don't render if already authenticated
  if (status === "authenticated") return null;

  // Dynamic header styles based on scroll
  const isScrolled = scrollY > 50;
  const headerBackground = isScrolled 
    ? 'bg-background/95 backdrop-blur-md border-border shadow-lg' 
    : 'bg-background/20 backdrop-blur-sm border-transparent';
  const headerShape = isScrolled 
    ? 'rounded-none border-b' 
    : 'mx-4 mt-4 rounded-full border';

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBackground} ${headerShape}`}>
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-1">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="/crystul.png" alt="Crystul Logo" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">
              <span className="text-primary font-mono font-bold">Crystul</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/ai-assistant">
              <span className="text-foreground hover:text-primary font-heading transition-colors font-medium">AI Assistant</span>
            </Link>
            <Link href="/connect-founders">
              <span className="text-foreground hover:text-primary font-heading transition-colors font-medium">Connect</span>
            </Link>
            <Link href="/explore">
              <span className="text-foreground hover:text-primary font-heading transition-colors font-medium">Explore</span>
            </Link>
            <Link href="/pricing">
              <span className="text-foreground hover:text-primary font-heading transition-colors font-medium">Pricing</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-lg">
                Get Started
              </Button>
            </Link>
            {/* <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full border border-border bg-background/50 hover:bg-primary/10">
              <div className="w-5 h-5 bg-primary rounded-full"></div>
            </Button> */}
            
            {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0 text-foreground hover:text-primary hover:bg-primary/10">
                    <Menu className="h-6 w-6" />
                  </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Link href="/ai-assistant">AI Assistant</Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Link href="/connect-founders">Connect with Founders</Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Link href="/explore">Explore Teams</Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                    <Link href="/pricing">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Link href="/auth/login">Sign In</Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Link href="/auth/register">Get Started</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/homevideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80"></div>
        </div>

        {/* Centered Content Overlay */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
            <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
                <span className="font-serif font-extrabold tracking-tight">Build Your</span>
                <br />
                <span className="text-primary font-serif font-black italic tracking-wide">
                    {currentText}
                  </span>
                </h1>
              <p className="text-xl md:text-2xl font-sans text-foreground/90 leading-relaxed max-w-3xl mx-auto">
                  Connect with like-minded entrepreneurs, find your perfect co-founders, and turn your startup ideas into reality with our intelligent matchmaking platform.
                </p>
              </div>
              
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-8 py-6 font-display font-semibold">
                    Start Building <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-display font-medium text-foreground border-primary hover:bg-primary hover:text-primary-foreground">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
                <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">100+</div>
                <div className="text-sm font-sans text-foreground/80">Entrepreneurs</div>
                </div>
                <div className="text-center">
                <div className="text-3xl font-display font-bold text-secondary-foreground">50+</div>
                <div className="text-sm font-sans text-foreground/80">Teams Formed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">10+</div>
                <div className="text-sm font-sans text-foreground/80">Startups Launched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Everything You Need to Build Together
          </h2>
          <p className="text-lg font-sans text-muted-foreground">
            Powerful tools designed specifically for startup teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-border bg-card/50 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <img 
                  src="/crystul.png" 
                  alt="Crystul Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <CardTitle className="font-display font-semibold text-foreground">Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans text-muted-foreground">
                Our AI-powered algorithm finds the perfect teammates based on skills, experience, and compatibility.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="font-display font-semibold text-foreground">Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans text-muted-foreground">
                Stay connected with your team through instant messaging, file sharing, and video calls.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display font-semibold text-foreground">Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans text-muted-foreground">
                Organize tasks, set milestones, and track progress with our intuitive Kanban boards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="font-display font-semibold text-foreground">Launch Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans text-muted-foreground">
                Create beautiful public profiles to showcase your startup and attract investors.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted border-t border-b border-border py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground font-sans">Active Entrepreneurs</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-secondary-foreground mb-2">50+</div>
              <div className="text-muted-foreground font-sans">Teams Formed</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground font-sans">Startups Launched</div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Partners Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Raise Funding with Our Partners
          </h2>
          <p className="text-lg font-sans text-muted-foreground">
            Registered teams can connect with funding partners, pitch, and raise for growth
          </p>
        </div>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img src="/image1.png" alt="Funding discussion" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-serif font-semibold text-foreground">
              Discover and Apply to Curated Funding Partners
            </h3>
            <p className="text-muted-foreground font-sans">
              As a verified team on Crystul, you gain access to a curated pool of funding partners
              and accelerators. Share your profile, traction, and goals — our platform helps route your
              pitch to the most relevant partners.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-muted-foreground font-sans">
              <li>Create a rich team profile and funding round details</li>
              <li>Get matched with partners aligned to your stage and industry</li>
              <li>Track outreach and communication in one place</li>
            </ul>
          </div>
        </div>

        {/* Row 2 (alternate sides) */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
          <div className="md:order-2 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img src="/image2.png" alt="Pitch deck review" className="w-full h-full object-cover" />
          </div>
          <div className="md:order-1 space-y-3">
            <h3 className="text-3xl font-serif font-semibold text-foreground">
              Pitch, Get Feedback, and Close Your Round
            </h3>
            <p className="text-muted-foreground font-sans">
              Start a conversation directly with partners, share your deck and metrics, and coordinate
              follow-ups from within chat. When it&apos;s a fit, move from intro to diligence seamlessly.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-muted-foreground font-sans">
              <li>Direct messaging with partners</li>
              <li>Share docs and links securely</li>
              <li>Stay organized with a single source of truth</li>
            </ul>
          </div>
        </div>

        {/* Scrolling partner logos */}
        <div className="relative overflow-hidden py-6 border-t border-b border-border -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex items-center gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            <div className="flex items-center gap-12 shrink-0">
              {['Sequoia','Accel','YC','Lightspeed','Andreessen Horowitz','Tiger Global','Matrix','Khosla','Bessemer','General Catalyst'].map((name, idx) => (
                <span key={idx} className="text-primary font-display text-lg md:text-xl opacity-80 hover:opacity-100 transition">
                  {name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
              {['Sequoia','Accel','YC','Lightspeed','Andreessen Horowitz','Tiger Global','Matrix','Khosla','Bessemer','General Catalyst'].map((name, idx) => (
                <span key={`dup-${idx}`} className="text-primary font-display text-lg md:text-xl opacity-80 hover:opacity-100 transition">
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
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-lg font-sans text-muted-foreground">
            See how entrepreneurs are building amazing teams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Rohit Taneja",
              title: "CEO, TechFlow",
              content: "Crystul helped me find the perfect CTO for my SaaS startup. The matching algorithm is incredibly accurate!",
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
              content: "Found my business partner here and we&apos;ve already raised our seed round. Highly recommend!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="border-border bg-card/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 font-sans">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-display font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground font-sans">{testimonial.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-foreground mb-8 font-sans">
            Join thousands of entrepreneurs who&apos;ve found their perfect teammates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-muted font-display font-semibold">
                Create Your Profile <CheckCircle className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-background bg-transparent text-background hover:bg-background hover:text-primary font-display font-semibold">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-foreground py-16 mt-16 w-full place-self-end rounded-t-xl">
        <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-6 sm:px-6 lg:px-8 lg:pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <img 
                src="/crystul.png" 
                alt="Crystul Logo" 
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-2xl font-mono font-bold">
                  Crystul
                </span>
              </div>

              <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
                Building successful startup teams through intelligent matchmaking. Connect with like-minded entrepreneurs, find your perfect co-founders, and turn your startup ideas into reality.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
              <div className="text-center sm:text-left">
                <p className="text-lg font-serif font-medium">About Us</p>
                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <Link href="/about" className="text-secondary-foreground/70 hover:text-primary transition">
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="text-secondary-foreground/70 hover:text-primary transition">
                      Meet the Team
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-secondary-foreground/70 hover:text-primary transition">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="text-secondary-foreground/70 hover:text-primary transition">
                      Press & Media
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg font-serif font-medium">Our Services</p>
                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <Link href="/ai-assistant" className="text-secondary-foreground/70 hover:text-primary transition">
                      AI Assistant
                    </Link>
                  </li>
                  <li>
                    <Link href="/connect-founders" className="text-secondary-foreground/70 hover:text-primary transition">
                      Founder Matching
                    </Link>
                  </li>
                  <li>
                    <Link href="/explore" className="text-secondary-foreground/70 hover:text-primary transition">
                      Team Discovery
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-secondary-foreground/70 hover:text-primary transition">
                      Pricing Plans
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg font-serif font-medium">Helpful Links</p>
                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <Link href="/help" className="text-secondary-foreground/70 hover:text-primary transition">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-secondary-foreground/70 hover:text-primary transition">
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/chat" className="group flex justify-center gap-1.5 sm:justify-start">
                      <span className="text-secondary-foreground/70 hover:text-primary transition">
                        Live Chat
                      </span>
                      <span className="relative flex size-2">
                        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                        <span className="bg-primary relative inline-flex size-2 rounded-full" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-secondary-foreground/70 hover:text-primary transition">
                      Blog & News
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg font-serif font-medium">Contact Us</p>
                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <Link href="tel:+919876543210"
                    target="_blank" 
                    rel="noopener noreferrer"  
                    className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.6a1 1 0 01.95.684l1.2 3.6a1 1 0 01-.27 1.04l-2.1 2.1a11.04 11.04 0 005.25 5.25l2.1-2.1a1 1 0 011.04-.27l3.6 1.2a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V5z"/>
                      </svg>
                      <span>+91 98765 43210</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="mailto:work@crystul.com"
                    target="_blank" 
                    rel="noopener noreferrer"  
                    className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l9 6 9-6"/>
                        <path d="M21 8v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8"/>
                        <path d="M3 8l9 6 9-6"/>
                      </svg>
                      <span>work@crystul.com</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://instagram.com/crystul_official"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2z"/>
                        <circle cx="12" cy="12" r="3.5"/>
                        <circle cx="17.5" cy="6.5" r="1.5"/>
                      </svg>
                      <span>@crystul_official</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="https://linkedin.com/company/crystul" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2"
                    >
                      <svg 
                        className="w-5 h-5 text-primary" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.5 20h-3v-11h3v11zm-1.5-12.27c-.96 0-1.73-.78-1.73-1.73s.78-1.73 1.73-1.73 1.73.78 1.73 1.73-.77 1.73-1.73 1.73zm13 12.27h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-3v-11h3v1.22c.84-1.16 2.37-1.72 3.79-1.22 1.1.39 2.21 1.57 2.21 3.28v7.72z"/>
                      </svg>
                      <span>linkedin.com/company/crystul</span>
                    </Link>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <div className="text-center sm:flex sm:justify-between sm:text-left">
              <p className="text-sm text-foreground/70">
                <span className="block sm:inline">All rights reserved.</span>
              </p>

              <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
                &copy; 2024 Crystul. Building the future of startup collaboration.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}