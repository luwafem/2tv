'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-4 border-t border-gray-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-black">2TV</h3>
            <p className="text-gray-600 mb-4">
              Premium IPTV streaming service with thousands of channels worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-black">Service</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#pricing" className="hover:text-black">Pricing Plans</a></li>
              <li><a href="#features" className="hover:text-black">Features</a></li>
              <li><a href="#" className="hover:text-black">Channel List</a></li>
              <li><a href="#" className="hover:text-black">Device Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-black">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-black">Setup Guide</a></li>
              <li><a href="#" className="hover:text-black">FAQ</a></li>
              <li><a href="#" className="hover:text-black">Contact Us</a></li>
              <li><a href="#" className="hover:text-black">Live Chat</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-black">Download Apps</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="https://www.videolan.org/vlc/" target="_blank" className="hover:text-black">VLC Player</a></li>
              <li><a href="#" className="hover:text-black">IPTV Smarters</a></li>
              <li><a href="#" className="hover:text-black">TiviMate</a></li>
              <li><a href="#" className="hover:text-black">Perfect Player</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 2TV. All rights reserved. Premium IPTV Service.</p>
        </div>
      </div>
    </footer>
  )
}
