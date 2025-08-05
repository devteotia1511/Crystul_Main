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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🦄</span>
            </div>
            <span className="text-xl font-display font-bold">Unicorn Tank</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="font-medium">Home</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the plan that fits your startup journey. Start free and upgrade as you grow.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-12">
              <Badge variant="secondary" className="text-sm">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
              <span className="text-sm text-gray-500">No hidden fees</span>
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
                    ? 'border-purple-500 shadow-lg scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-display font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className="block">
                    <Button 
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                    Can I change my plan anytime?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our Starter plan is completely free forever. No trial needed - just sign up and start building!
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
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
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of entrepreneurs who've found their perfect teammates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-display font-semibold">
                  <Rocket className="mr-2 w-5 h-5" />
                  Start Building Today
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="font-display font-semibold">
                  Learn More
                </Button>
              </Link>
            </div>
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
              <span className="text-xl font-display font-bold">Unicorn Tank</span>
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