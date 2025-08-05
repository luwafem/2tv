'use client'

export default function Features() {
  const features = [
    {
      title: "HD Quality Streaming",
      description: "Enjoy crystal clear HD and 4K streaming on all your devices",
      icon: "📺"
    },
    {
      title: "Multi-Device Support",
      description: "Watch on TV, phone, tablet, or computer - anywhere, anytime",
      icon: "📱"
    },
    {
      title: "Global Content",
      description: "Access channels from around the world in multiple languages",
      icon: "🌍"
    },
    {
      title: "No Buffering",
      description: "Our premium servers ensure smooth streaming without interruptions",
      icon: "⚡"
    },
    {
      title: "Easy Setup",
      description: "Get started in minutes with our simple setup process",
      icon: "⚙️"
    },
    {
      title: "24/7 Support",
      description: "Our support team is always ready to help you",
      icon: "🎧"
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose 2TV?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We provide the best IPTV experience with cutting-edge technology and premium content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-black p-8 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Compatible IPTV Players</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <h4 className="font-semibold">VLC Player</h4>
              <p className="text-sm text-gray-400 mt-2">Free & Cross-platform</p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <h4 className="font-semibold">IPTV Smarters</h4>
              <p className="text-sm text-gray-400 mt-2">Mobile & Smart TV</p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <h4 className="font-semibold">TiviMate</h4>
              <p className="text-sm text-gray-400 mt-2">Android TV</p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <h4 className="font-semibold">Perfect Player</h4>
              <p className="text-sm text-gray-400 mt-2">Android & iOS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
