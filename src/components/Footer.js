'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">2TV</h3>
            <p className="text-gray-400 mb-4">
              Premium IPTV streaming service with thousands of channels worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#pricing" className="hover:text-white">Pricing Plans</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Channel List</a></li>
              <li><a href="#" className="hover:text-white">Device Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Setup Guide</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Live Chat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Download Apps</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://www.videolan.org/vlc/" target="_blank" className="hover:text-white">VLC Player</a></li>
              <li><a href="#" className="hover:text-white">IPTV Smarters</a></li>
              <li><a href="#" className="hover:text-white">TiviMate</a></li>
              <li><a href="#" className="hover:text-white">Perfect Player</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 2TV. All rights reserved. Premium IPTV Service.</p>
        </div>
      </div>
    </footer>
  )
}
