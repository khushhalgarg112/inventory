export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🛍️ E-commerce Tracking Bot
          </h1>
          <p className="text-gray-600 mb-8">
            Your automated stock monitoring system for multiple e-commerce platforms
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Supported Platforms
            </h2>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Croma</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Samsung</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Flipkart</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Reliance Digital</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">iQOO</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Vivo</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-yellow-900 mb-3">
              🔔 Features
            </h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li>• Real-time stock monitoring</li>
              <li>• Telegram notifications on stock availability</li>
              <li>• Multi-platform support</li>
              <li>• Configurable pincode tracking</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              API Endpoints
            </h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-green-600 font-bold">GET</span>{" "}
                <span className="text-gray-700">/api/test</span>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <span className="text-blue-600 font-bold">POST</span>{" "}
                <span className="text-gray-700">/api/cron</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Deployed on Vercel | Status: Active
          </p>
        </div>
      </div>
    </div>
  );
}

