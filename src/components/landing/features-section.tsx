'use client'

import { motion } from 'framer-motion'
import { Lock, Zap, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Your bookmarks are private to you. We use Row Level Security to ensure your data is safe.',
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Changes appear instantly across all your devices. No refresh needed.',
  },
  {
    icon: Smartphone,
    title: 'Simple & Clean',
    description: 'Beautiful, intuitive interface that works on all devices. Light and dark mode included.',
  },
]

export function FeaturesSection() {
  return (
    <div className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Smart Bookmark?</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need in a bookmark manager, nothing you don't
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
