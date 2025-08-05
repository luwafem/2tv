'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import PricingPlans from '@/components/PricingPlans'
import Features from '@/components/Features'
import PaymentModal from '@/components/PaymentModal'
import PaymentFallback from '@/components/PaymentFallback'
import Footer from '@/components/Footer'

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  const handlePaymentError = () => {
    setShowPaymentModal(false)
    setShowFallback(true)
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero />
      <Features />
      <PricingPlans onPlanSelect={handlePlanSelect} />
      <Footer />
      
      {showPaymentModal && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onError={handlePaymentError}
        />
      )}

      {showFallback && (
        <PaymentFallback
          plan={selectedPlan}
          onClose={() => setShowFallback(false)}
        />
      )}
    </main>
  )
}
