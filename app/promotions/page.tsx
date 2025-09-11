"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Star, 
  Zap, 
  Users, 
  Trophy, 
  Sparkles,
  Clock,
  Target,
  Rocket,
  Crown,
  Home
} from 'lucide-react';

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/crystul.png" 
              alt="Crystul Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-mono font-bold text-primary">Crystul</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
              Limited Time Offers
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            Exclusive <span className="text-primary">Promotions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock special deals, premium features, and exclusive opportunities to accelerate your startup journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold">
                <Gift className="mr-2 w-5 h-5" />
                Claim Your Offers
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="font-display font-semibold border-primary hover:bg-primary hover:text-primary-foreground">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Promotions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Current Promotions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take advantage of these limited-time offers designed to help your startup thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Early Bird Special */}
            <Card className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-3 -right-3">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Rocket className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <CardTitle className="text-2xl text-foreground">Early Bird Special</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Limited to first 100 users
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-display font-bold text-primary mb-2">50% OFF</div>
                  <p className="text-muted-foreground">Premium features for 6 months</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-primary mr-2" />
                    <span>Unlimited team creation</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-primary mr-2" />
                    <span>Priority matching algorithm</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-primary mr-2" />
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <Crown className="w-4 h-4 text-primary mr-2" />
                    <span>VIP support channel</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Expires in 7 days</span>
                </div>
                <Link href="/auth/register" className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold">
                    Claim Offer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Student Discount */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Trophy className="w-8 h-8 text-secondary-foreground mr-3" />
                  <div>
                    <CardTitle className="text-2xl text-foreground">Student Discount</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      For university students
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-display font-bold text-secondary-foreground mb-2">75% OFF</div>
                  <p className="text-muted-foreground">All premium features</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-secondary-foreground mr-2" />
                    <span>Complete platform access</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-secondary-foreground mr-2" />
                    <span>Student networking events</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-secondary-foreground mr-2" />
                    <span>Mentorship program access</span>
                  </li>
                  <li className="flex items-center">
                    <Crown className="w-4 h-4 text-secondary-foreground mr-2" />
                    <span>Educational resources</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Valid with .edu email</span>
                </div>
                <Link href="/auth/register" className="block">
                  <Button variant="outline" className="w-full border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary font-display font-semibold">
                    Verify Student Status
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Startup Accelerator */}
            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <CardTitle className="text-2xl text-foreground">Startup Accelerator</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Comprehensive growth package
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-display font-bold text-primary mb-2">FREE</div>
                  <p className="text-muted-foreground">3 months premium + mentorship</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Zap className="w-4 h-4 text-primary mr-2" />
                    <span>1-on-1 mentor sessions</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 text-primary mr-2" />
                    <span>Investor introduction program</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-primary mr-2" />
                    <span>Business plan review</span>
                  </li>
                  <li className="flex items-center">
                    <Crown className="w-4 h-4 text-primary mr-2" />
                    <span>Pitch deck optimization</span>
                  </li>
                </ul>
                <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Application required</span>
                </div>
                <Link href="/auth/register" className="block">
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold">
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Exclusive Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Additional perks available with our promotional offers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">Free Swag Kit</h3>
              <p className="text-muted-foreground text-sm">
                Branded merchandise for early adopters
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">VIP Community</h3>
              <p className="text-muted-foreground text-sm">
                Access to exclusive networking events
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">Priority Support</h3>
              <p className="text-muted-foreground text-sm">
                24/7 dedicated support channel
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">Success Stories</h3>
              <p className="text-muted-foreground text-sm">
                Feature your startup on our platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Don&apos;t Miss Out!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              These exclusive promotions won&apos;t last long. Join thousands of successful entrepreneurs today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold">
                  <Rocket className="mr-2 w-5 h-5" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="font-display font-semibold text-foreground border-primary hover:bg-primary hover:text-primary-foreground">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/crystul.png" 
                alt="Crystul Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-mono font-bold text-primary">Crystul</span>
            </div>
            <div className="text-muted-foreground font-sans">
              © 2024 Crystul. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
