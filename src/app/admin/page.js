'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export default function AdminDashboard() {
  const [subscriptions, setSubscriptions] = useState([])
  const [settings, setSettings] = useState({
    basicUrl: 'http://your-server.com:8080/basic/playlist.m3u8',
    premiumUrl: 'http://your-server.com:8080/premium/playlist.m3u8',
    ultimateUrl: 'http://your-server.com:8080/ultimate/playlist.m3u8',
    basicPrice: 2500,
    premiumPrice: 4000,
    ultimatePrice: 6000
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('subscriptions')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subscriptions'))
      const subs = []
      querySnapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() })
      })
      setSubscriptions(subs.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()))
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubscriptionStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'subscriptions', id), { status })
      fetchSubscriptions()
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  const deleteSubscription = async (id) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteDoc(doc(db, 'subscriptions', id))
        fetchSubscriptions()
      } catch (error) {
        console.error('Error deleting subscription:', error)
      }
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString()
  }

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false
    const expDate = expirationDate.toDate ? expirationDate.toDate() : new Date(expirationDate)
    return expDate < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">2TV Admin Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'subscriptions' 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'settings' 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Total Subscriptions</h3>
                <p className="text-3xl font-bold">{subscriptions.length}</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Active</h3>
                <p className="text-3xl font-bold text-green-400">
                  {subscriptions.filter(sub => sub.status === 'active' && !isExpired(sub.expirationDate)).length}
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Expired</h3>
                <p className="text-3xl font-bold text-red-400">
                  {subscriptions.filter(sub => isExpired(sub.expirationDate)).length}
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-400">
                  ₦{subscriptions.reduce((total, sub) => total + (sub.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Plan</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                      <th className="px-6 py-4 text-left">Created</th>
                      <th className="px-6 py-4 text-left">Expires</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-t border-gray-800">
                        <td className="px-6 py-4">{sub.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-800 px-2 py-1 rounded text-sm">
                            {sub.planName}
                          </span>
                        </td>
                        <td className="px-6 py-4">₦{sub.amount?.toLocaleString()}</td>
                        <td className="px-6 py-4">{formatDate(sub.createdAt)}</td>
                        <td className="px-6 py-4">
                          <span className={isExpired(sub.expirationDate) ? 'text-red-400' : 'text-green-400'}>
                            {formatDate(sub.expirationDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            isExpired(sub.expirationDate) 
                              ? 'bg-red-900 text-red-300' 
                              : sub.status === 'active' 
                                ? 'bg-green-900 text-green-300'
                                : 'bg-gray-800 text-gray-300'
                          }`}>
                            {isExpired(sub.expirationDate) ? 'Expired' : sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateSubscriptionStatus(sub.id, sub.status === 'active' ? 'suspended' : 'active')}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              {sub.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteSubscription(sub.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-6">IPTV Server URLs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Basic Plan URL</label>
                  <input
                    type="url"
                    value={settings.basicUrl}
                    onChange={(e) => setSettings({...settings, basicUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Premium Plan URL</label>
                  <input
                    type="url"
                    value={settings.premiumUrl}
                    onChange={(e) => setSettings({...settings, premiumUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ultimate Plan URL</label>
                  <input
                    type="url"
                    value={settings.ultimateUrl}
                    onChange={(e) => setSettings({...settings, ultimateUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-6">Pricing Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Basic Plan Price (₦)</label>
                  <input
                    type="number"
                    value={settings.basicPrice}
                    onChange={(e) => setSettings({...settings, basicPrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Premium Plan Price (₦)</label>
                  <input
                    type="number"
                    value={settings.premiumPrice}
                    onChange={(e) => setSettings({...settings, premiumPrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ultimate Plan Price (₦)</label>
                  <input
                    type="number"
                    value={settings.ultimatePrice}
                    onChange={(e) => setSettings({...settings, ultimatePrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
