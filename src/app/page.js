'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import PricingPlans from '@/components/PricingPlans'
import Features from '@/components/Features'
import PaymentModal from '@/components/PaymentModal'
import Footer from '@/components/Footer'

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
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
        />
      )}
    </main>
  )
}
