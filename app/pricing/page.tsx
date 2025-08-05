"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/paytm';
import { toast } from 'sonner';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch('/api/paytm/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.success && plan === 'free') {
        toast.success('Successfully upgraded to free plan!');
        router.push('/dashboard');
        return;
      }

      if (data.paytmParams) {
        // Create a form and submit to Paytm
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://securegw-stage.paytm.in/theia/processTransaction'; // Use production URL for live

        // Add Paytm parameters to form
        Object.keys(data.paytmParams).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.paytmParams[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      key: 'free',
      name: 'Free',
      price: '₹0',
      description: 'Perfect for getting started',
      icon: Sparkles,
      features: SUBSCRIPTION_PLANS.free.features,
      popular: false,
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '₹999',
      description: 'For growing teams',
      icon: Zap,
      features: SUBSCRIPTION_PLANS.pro.features,
      popular: true,
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: '₹2,999',
      description: 'For large organizations',
      icon: Crown,
      features: SUBSCRIPTION_PLANS.enterprise.features,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">🦄</span>
            </div>
            <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Unicorn Tank</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push('/')} className="font-medium">
              Home
            </Button>
            {session ? (
              <Button onClick={() => router.push('/dashboard')} className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => router.push('/auth/login')} className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl font-sans text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start building your dream team with the perfect plan for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.key} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-display font-bold">{plan.name}</CardTitle>
                    <CardDescription className="font-sans">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      {plan.key !== 'free' && <span className="text-gray-600 dark:text-gray-300 font-sans">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="font-sans text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribe(plan.key)}
                      disabled={loading === plan.key}
                      className={`w-full font-display font-semibold ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                      }`}
                    >
                      {loading === plan.key ? (
                        'Processing...'
                      ) : plan.key === 'free' ? (
                        'Get Started'
                      ) : (
                        'Subscribe Now'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-display font-semibold text-lg mb-2">Can I change plans anytime?</h3>
                <p className="font-sans text-gray-600 dark:text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-display font-semibold text-lg mb-2">Is there a free trial?</h3>
                <p className="font-sans text-gray-600 dark:text-gray-300">
                  We offer a 14-day free trial for all paid plans. No credit card required to start.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-display font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="font-sans text-gray-600 dark:text-gray-300">
                  We accept all major credit cards, debit cards, and digital wallets through Stripe.
                </p>
              </div>
              <div className="text-left">
                <h3 className="font-display font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="font-sans text-gray-600 dark:text-gray-300">
                  Absolutely! You can cancel your subscription at any time and continue using the service until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 