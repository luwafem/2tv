'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { generateUserUrl, getExpirationDate, isValidEmail } from '@/lib/utils'

export default function PaymentModal({ plan, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
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
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Complete Payment</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-black p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-lg">{plan.name} Plan</h4>
            <p className="text-gray-400">1 Month Subscription</p>
            <p className="text-2xl font-bold mt-2">
              ₦{plan.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
            required
          />
          <p className="text-xs text-gray-400 mt-2">
            Your streaming URL will be sent to this email
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || !email}
          className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : `Pay ₦${plan.price.toLocaleString()}`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Secure payment powered by Paystack
        </p>
      </div>

      {/* Load Paystack script */}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  )
}
