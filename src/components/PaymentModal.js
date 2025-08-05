'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { generateUserUrl, getExpirationDate, isValidEmail } from '@/lib/utils.js'

export default function PaymentModal({ plan, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  useEffect(() => {
    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      setPaystackLoaded(true)
      return
    }

    // Load Paystack script dynamically
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    script.onerror = () => setError('Failed to load payment system')
    document.body.appendChild(script)

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if Paystack is loaded
      if (!paystackLoaded || typeof window === 'undefined' || !window.PaystackPop) {
        setError('Payment system is loading. Please try again in a moment.')
        setLoading(false)
        return
      }

      // Generate unique URL for user
      const userUrl = generateUserUrl(email, plan.id)
      const expirationDate = getExpirationDate()

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: 'pk_live_2ba1413aaaf5091188571ea6f87cca34945d943c',
        email: email,
        amount: plan.price * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: `2tv_${plan.id}_${Date.now()}`,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name,
          user_url: userUrl,
          expiration_date: expirationDate.toISOString()
        },
        callback: async function(response) {
          // Payment successful
          try {
            // Save subscription to Firebase
            await addDoc(collection(db, 'subscriptions'), {
              email: email,
              planId: plan.id,
              planName: plan.name,
              amount: plan.price,
              paymentRef: response.reference,
              userUrl: userUrl,
              expirationDate: expirationDate,
              createdAt: new Date(),
              status: 'active'
            })

            // Send confirmation email via Formspree
            await fetch('https://formspree.io/f/xblkzybg', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                subject: `2TV Subscription Confirmation - ${plan.name} Plan`,
                message: `
                  Thank you for subscribing to 2TV ${plan.name} Plan!
                  
                  Your IPTV Access Details:
                  - Plan: ${plan.name}
                  - Amount Paid: ₦${plan.price.toLocaleString()}
                  - Your Streaming URL: ${userUrl}
                  - Expires: ${expirationDate.toLocaleDateString()}
                  
                  Download IPTV Players:
                  - VLC Player: https://www.videolan.org/vlc/
                  - IPTV Smarters: Available on App Store/Google Play
                  - TiviMate: Available on Google Play
                  - Perfect Player: Available on App Store/Google Play
                  
                  Setup Instructions will be sent to you shortly.
                  
                  Thank you for choosing 2TV!
                `
              })
            })

            alert(`Payment successful! Your streaming URL: ${userUrl}`)
            onClose()
          } catch (error) {
            console.error('Error saving subscription:', error)
            alert('Payment successful but there was an error. Please contact support.')
          }
        },
        onClose: function() {
          setLoading(false)
        }
      })

      handler.openIframe()
    } catch (error) {
      setError('Payment initialization failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-300 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-black">Complete Payment</h3>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg text-black">{plan.name} Plan</h4>
            <p className="text-gray-600">1 Month Subscription</p>
            <p className="text-2xl font-bold mt-2 text-black">
              ₦{plan.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-black">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-black focus:outline-none text-black"
            required
          />
          <p className="text-xs text-gray-600 mt-2">
            Your streaming URL will be sent to this email
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !email || !paystackLoaded}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : !paystackLoaded ? 'Loading Payment...' : `Pay ₦${plan.price.toLocaleString()}`}
        </button>

        <p className="text-xs text-gray-600 text-center mt-4">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  )
}
