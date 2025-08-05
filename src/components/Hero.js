'use client'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080?text=Premium+IPTV+Streaming+Background')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          2TV
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Experience premium IPTV streaming with thousands of channels, HD quality, and reliable service
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Plans
          </button>
          
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            Learn More
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-white">10,000+</h3>
            <p className="text-gray-400">Live Channels</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">99.9%</h3>
            <p className="text-gray-400">Uptime</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">24/7</h3>
            <p className="text-gray-400">Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
