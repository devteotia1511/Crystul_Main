"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Users, Rocket } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individual entrepreneurs",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Create your profile",
        "Browse other entrepreneurs",
        "Send 5 connection requests/month",
        "Basic team matching",
        "Community access"
      ],
      cta: "Get Started",
      href: "/auth/register",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious entrepreneurs building teams",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Everything in Starter",
        "Unlimited connection requests",
        "Advanced team matching",
        "Priority support",
        "Team analytics",
        "Custom team profiles",
        "Direct messaging"
      ],
      cta: "Coming Soon",
      href: "#",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For established startups and companies",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Pro",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "Priority onboarding"
      ],
      cta: "Contact Sales",
      href: "#",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
              <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10">Home</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="font-medium bg-primary text-primary-foreground hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that fits your startup journey. Start free and upgrade as you grow.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-12">
              <Badge variant="secondary" className="text-sm bg-primary/20 text-primary border-primary/30">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
              <span className="text-sm text-muted-foreground">No hidden fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border'
                } bg-card/50 backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-display font-bold text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-display font-bold text-primary">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className="block">
                    <Button 
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:opacity-90'
                          : 'bg-card text-foreground border-primary hover:bg-primary hover:text-primary-foreground'
                      }`}
                      disabled={plan.href === "#"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Can I change my plan anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-muted-foreground">
                    Our Starter plan is completely free forever. No trial needed - just sign up and start building!
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Absolutely! You can cancel your subscription at any time with no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of entrepreneurs who&apos;ve found their perfect teammates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 font-display font-semibold">
                  <Rocket className="mr-2 w-5 h-5" />
                  Start Building Today
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="font-display font-semibold text-foreground border-primary hover:bg-primary hover:text-primary-foreground">
                  Learn More
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