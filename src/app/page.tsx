'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Trophy, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-linear-to-br from-green-900/90 to-slate-900/90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587309322384-a82f3c09fcc6?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-green-300 font-medium text-sm mb-6 border border-green-500/30 backdrop-blur-sm"
          >
            Play with Purpose
          </motion.span>
          <motion.h1 
            {...fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mb-6"
          >
            Make Every Swing <span className="text-green-400">Count</span>
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10"
          >
            Join the only golf subscription platform that turns your scores into prizes while supporting the charities you love.
          </motion.p>
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-lg h-14 px-8 group">
                Start Playing Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg h-14 px-8">
                Learn How It Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            >
              More Than Just Golf
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              We've created a unique ecosystem where your passion for golf translates directly into real-world impact and incredible rewards.
            </motion.p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              { title: 'Track Your Progress', icon: Target, color: 'bg-blue-100 text-blue-600', desc: 'Log your Stableford scores. We keep your latest 5 rounds to measure your current form and handicap trajectory.' },
              { title: 'Win Huge Prizes', icon: Trophy, color: 'bg-amber-100 text-amber-600', desc: 'Enter our monthly lottery-style draws. Match 3, 4, or 5 numbers to win a share of the rolling jackpot.' },
              { title: 'Support Charities', icon: Heart, color: 'bg-green-100 text-green-600', desc: 'At least 10% of your subscription goes directly to a charity of your choice. You play, they benefit.' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-none shadow-lg bg-white dark:bg-slate-800 transition-shadow hover:shadow-xl">
                  <CardContent className="pt-8 px-6 pb-8 text-center flex flex-col items-center">
                    <div className={`h-16 w-16 ${feature.color} dark:bg-opacity-20 rounded-full flex items-center justify-center mb-6`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white dark:bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                The Platform Built for <span className="text-green-600 dark:text-green-400">Giving Back</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                When you subscribe to Fairway Impact, you're not just getting a chance to win. You're joining a community dedicated to making a difference.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Choose from dozens of verified charities',
                  'Increase your donation percentage anytime',
                  'Track total community impact on the leaderboard',
                  'Tax-deductible contribution receipts provided'
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start"
                  >
                    <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-1 rounded-full mr-4 text-green-600 dark:text-green-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="pt-4">
                <Link href="/charities">
                  <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950">
                    View Supported Charities
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-square md:aspect-4/3 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative shadow-2xl p-8 flex flex-col justify-between">
                {/* Header */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">Community Impact</p>
                  <h3 className="text-2xl font-bold text-white">Where Your Money Goes</h3>
                </div>

                {/* Breakdown bars */}
                <div className="space-y-5 my-4">
                  {[
                    { label: 'Prize Pool', pct: 50, color: 'bg-amber-400', val: '50%' },
                    { label: 'Charity Donation', pct: 10, color: 'bg-green-400', val: '10%+' },
                    { label: 'Platform & Ops', pct: 40, color: 'bg-slate-500', val: '40%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className="text-white font-bold">{item.val}</span>
                      </div>
                      <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charity category chips */}
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Supported Causes</p>
                  <div className="flex flex-wrap gap-2">
                    {['🌲 Environment', '❤️ Health', '📚 Education', '🐾 Animals', '🏠 Homelessness', '⚽ Youth Sport'].map((tag) => (
                      <span key={tag} className="text-xs bg-slate-700 text-slate-200 rounded-full px-3 py-1 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs"
              >
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Raised</p>
                 <p className="text-4xl font-bold text-green-600 dark:text-green-400">$142,500+</p>
                 <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">For local and national charities this year alone.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-600 dark:bg-green-700 text-white text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-4xl relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Join the Club?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Sign up today, log your scores, pick your charity, and get ready for the next big draw.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-green-700 hover:bg-slate-100 text-lg h-14 px-10 shadow-lg font-bold">
              Create Your Account
            </Button>
          </Link>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </section>
    </div>
  )
}

