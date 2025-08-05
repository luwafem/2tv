'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function StreamPage({ params }) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const streamId = params.id
        const q = query(
          collection(db, 'subscriptions'),
          where('userUrl', '==', `${window.location.origin}/stream/${streamId}`)
        )
        
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const subData = querySnapshot.docs[0].data()
          
          // Check if subscription is expired
          const expirationDate = subData.expirationDate.toDate()
          const now = new Date()
          
          if (expirationDate < now) {
            setError('Your subscription has expired. Please renew to continue streaming.')
          } else if (subData.status !== 'active') {
            setError('Your subscription is not active. Please contact support.')
          } else {
            setSubscription(subData)
          }
        } else {
          setError('Invalid streaming URL. Please check your link or contact support.')
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
        setError('Error loading your subscription. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [params.id])

  const getStreamUrl = (planId) => {
    const urls = {
      basic: 'http://your-server.com:8080/basic/playlist.m3u8',
      premium: 'http://your-server.com:8080/premium/playlist.m3u8',
      ultimate: 'http://your-server.com:8080/ultimate/playlist.m3u8'
    }
    return urls[planId] || urls.basic
  }

  const downloadApps = [
    {
      name: 'VLC Player',
      description: 'Free cross-platform media player',
      platforms: 'Windows, Mac, Linux, Android, iOS',
      url: 'https://www.videolan.org/vlc/',
      instructions: 'Open VLC → Media → Open Network Stream → Paste your M3U8 URL'
    },
    {
      name: 'IPTV Smarters Pro',
      description: 'Professional IPTV player',
      platforms: 'Android, iOS, Smart TV',
      url: '#',
      instructions: 'Add Playlist → Enter M3U8 URL → Username: your email → Password: (leave blank)'
    },
    {
      name: 'TiviMate',
      description: 'Premium IPTV player for Android TV',
      platforms: 'Android TV, Fire TV',
      url: '#',
      instructions: 'Add Playlist → M3U8 URL → Enter your streaming URL'
    },
    {
      name: 'Perfect Player',
      description: 'Simple and reliable IPTV player',
      platforms: 'Android, iOS',
      url: '#',
      instructions: 'Settings → Playlist → Add URL → Enter your M3U8 link'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your streaming access...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <a 
            href="/"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to 2TV</h1>
          <p className="text-xl text-gray-400">Your {subscription.planName} Plan is Active</p>
        </div>

        {/* Subscription Info */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-12 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Plan</h3>
              <p className="text-2xl font-bold text-green-400">{subscription.planName}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Expires</h3>
              <p className="text-xl">{subscription.expirationDate.toDate().toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <span className="bg-green-900 text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Streaming URL */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-12 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Your Streaming URL</h2>
          <div className="bg-black p-4 rounded-lg border border-gray-700 mb-4">
            <code className="text-green-400 break-all">{getStreamUrl(subscription.planId)}</code>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(getStreamUrl(subscription.planId))}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Copy URL
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Setup Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {downloadApps.map((app, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{app.description}</p>
                    <p className="text-gray-500 text-xs">{app.platforms}</p>
                  </div>
                  {app.url !== '#' && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      Download
                    </a>
                  )}
                </div>
                <div className="bg-black p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">{app.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-400 mb-6">
            Our support team is available 24/7 to help you with setup and any issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:support@2tv.com?subject=Support Request - ${subscription.email}`}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Email Support
            </a>
            <a
              href="#"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
            >
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
