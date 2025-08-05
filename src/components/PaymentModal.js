'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { generateUserUrl, getExpirationDate, isValidEmail } from '@/lib/utils.js'

export default function PaymentModal({ plan, onClose, onError }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  useEffect(() => {
    // Check if Paystack is already loaded
    if (typeof window !== 'undefined' && window.PaystackPop) {
      setPaystackLoaded(true)
      return
    }

    // Load Paystack script dynamically
    const loadPaystack = () => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')
        if (existingScript) {
          if (window.PaystackPop) {
            resolve()
          } else {
            existingScript.onload = resolve
            existingScript.onerror = reject
          }
          return
        }

        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    loadPaystack()
      .then(() => {
        setPaystackLoaded(true)
        setError('')
      })
      .catch(() => {
        setError('Failed to load payment system. Please refresh and try again.')
      })
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
        setError('Payment system is still loading. Please wait a moment and try again.')
        setLoading(false)
        return
      }

      console.log('Initializing Paystack payment...') // Debug log

      // Generate unique URL for user
      const userUrl = generateUserUrl(email, plan.id)
      const expirationDate = getExpirationDate()
      const paymentRef = `2tv_${plan.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log('Payment details:', { email, amount: plan.price * 100, ref: paymentRef }) // Debug log

      // Define callback function separately to avoid scope issues
      const paymentCallback = async (response) => {
        console.log('Payment callback received:', response) // Debug log
        setLoading(true)
        
        try {
          // Save subscription to Firebase
          const subscriptionData = {
            email: email,
            planId: plan.id,
            planName: plan.name,
            amount: plan.price,
            paymentRef: response.reference,
            userUrl: userUrl,
            expirationDate: expirationDate,
            createdAt: new Date(),
            status: 'active',
            paystackResponse: response
          }

          console.log('Saving to Firebase:', subscriptionData) // Debug log
          await addDoc(collection(db, 'subscriptions'), subscriptionData)

          // Send confirmation email via Formspree
          const emailData = {
            email: email,
            subject: `2TV Subscription Confirmation - ${plan.name} Plan`,
            message: `Thank you for subscribing to 2TV ${plan.name} Plan!
            
Your IPTV Access Details:
- Plan: ${plan.name}
- Amount Paid: ₦${plan.price.toLocaleString()}
- Payment Reference: ${response.reference}
- Your Streaming URL: ${userUrl}
- Expires: ${expirationDate.toLocaleDateString()}

Download IPTV Players:
- VLC Player: https://www.videolan.org/vlc/
- IPTV Smarters: Available on App Store/Google Play
- TiviMate: Available on Google Play
- Perfect Player: Available on App Store/Google Play

Setup Instructions:
1. Download any of the IPTV players above
2. Open the app and add a new playlist
3. Enter your streaming URL: ${userUrl}
4. Start enjoying your IPTV service!

Thank you for choosing 2TV!`
          }

          console.log('Sending email via Formspree...') // Debug log
          const emailResponse = await fetch('https://formspree.io/f/xblkzybg', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
          })

          if (emailResponse.ok) {
            console.log('Email sent successfully') // Debug log
          } else {
            console.error('Email sending failed:', emailResponse.status) // Debug log
          }

          // Show success message with streaming URL
          alert(`🎉 Payment Successful!

Your IPTV access is now active!

Streaming URL: ${userUrl}
Plan: ${plan.name}
Expires: ${expirationDate.toLocaleDateString()}

Check your email for detailed setup instructions.`)
          
          onClose()
        } catch (error) {
          console.error('Error processing payment:', error)
          alert(`Payment was successful, but there was an error setting up your account. 

Payment Reference: ${response.reference}
Please contact support with this reference number.`)
        } finally {
          setLoading(false)
        }
      }

      const closeCallback = () => {
        console.log('Payment modal closed') // Debug log
        setLoading(false)
      }

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: 'pk_live_2ba1413aaaf5091188571ea6f87cca34945d943c',
        email: email,
        amount: plan.price * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: paymentRef,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name,
          user_url: userUrl,
          expiration_date: expirationDate.toISOString(),
          custom_fields: [
            {
              display_name: "Plan Type",
              variable_name: "plan_type",
              value: plan.name
            }
          ]
        },
        callback: paymentCallback,
        onClose: closeCallback
      })

      console.log('Opening Paystack iframe...') // Debug log
      handler.openIframe()
    } catch (error) {
      console.error('Payment initialization error:', error)
      setError(`Payment initialization failed: ${error.message}. Please refresh the page and try again.`)
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
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
        >
          {loading ? 'Processing...' : !paystackLoaded ? 'Loading Payment...' : `Pay ₦${plan.price.toLocaleString()}`}
        </button>

        <button
          onClick={onError}
          className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors mb-4"
        >
          Try Alternative Payment Method
        </button>

        <p className="text-xs text-gray-600 text-center">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  )
}
