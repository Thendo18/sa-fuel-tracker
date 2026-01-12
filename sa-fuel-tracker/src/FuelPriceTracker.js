import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Bell, DollarSign, AlertTriangle, Calendar, Navigation } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const FuelPriceTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFuelType, setSelectedFuelType] = useState('petrol95');
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [userLocation, setUserLocation] = useState('Gauteng');
  const [alertThreshold, setAlertThreshold] = useState(5);

  // Simulated historical price data
  const priceHistory = [
    { date: 'Jan 1', petrol95: 22.45, petrol93: 22.12, diesel: 21.89, coastal: 22.15 },
    { date: 'Jan 8', petrol95: 22.78, petrol93: 22.45, diesel: 22.12, coastal: 22.48 },
    { date: 'Jan 15', petrol95: 23.12, petrol93: 22.79, diesel: 22.56, coastal: 22.82 },
    { date: 'Jan 22', petrol95: 22.89, petrol93: 22.56, diesel: 22.33, coastal: 22.59 },
    { date: 'Jan 29', petrol95: 23.45, petrol93: 23.12, diesel: 22.89, coastal: 23.15 },
    { date: 'Feb 5', petrol95: 24.12, petrol93: 23.79, diesel: 23.56, coastal: 23.82 },
    { date: 'Feb 12', petrol95: 24.89, petrol93: 24.56, diesel: 24.33, coastal: 24.59 }
  ];

  // Current prices by province
  const currentPrices = {
    'Gauteng': { petrol95: 24.89, petrol93: 24.56, diesel: 24.33, change: 2.3 },
    'Western Cape': { petrol95: 24.59, petrol93: 24.26, diesel: 24.03, change: 2.1 },
    'KwaZulu-Natal': { petrol95: 24.72, petrol93: 24.39, diesel: 24.16, change: 2.2 },
    'Eastern Cape': { petrol95: 24.68, petrol93: 24.35, diesel: 24.12, change: 2.2 },
    'Free State': { petrol95: 24.85, petrol93: 24.52, diesel: 24.29, change: 2.3 },
    'Mpumalanga': { petrol95: 24.91, petrol93: 24.58, diesel: 24.35, change: 2.4 },
    'Limpopo': { petrol95: 24.94, petrol93: 24.61, diesel: 24.38, change: 2.4 },
    'North West': { petrol95: 24.87, petrol93: 24.54, diesel: 24.31, change: 2.3 },
    'Northern Cape': { petrol95: 24.79, petrol93: 24.46, diesel: 24.23, change: 2.2 }
  };

  // Nearby stations by province
  const stationsByProvince = {
    'Gauteng': [
      { name: 'Engen Sandton', distance: 2.3, petrol95: 24.85, petrol93: 24.52, diesel: 24.29, rating: 4.5 },
      { name: 'Shell Rivonia', distance: 3.1, petrol95: 24.89, petrol93: 24.56, diesel: 24.33, rating: 4.7 },
      { name: 'BP Woodmead', distance: 4.2, petrol95: 24.92, petrol93: 24.59, diesel: 24.36, rating: 4.3 },
      { name: 'Sasol Midrand', distance: 5.8, petrol95: 24.87, petrol93: 24.54, diesel: 24.31, rating: 4.6 },
      { name: 'Total Fourways', distance: 6.5, petrol95: 24.95, petrol93: 24.62, diesel: 24.39, rating: 4.4 }
    ],
    'Western Cape': [
      { name: 'Engen V&A Waterfront', distance: 1.8, petrol95: 24.55, petrol93: 24.22, diesel: 23.99, rating: 4.8 },
      { name: 'Shell Sea Point', distance: 2.5, petrol95: 24.59, petrol93: 24.26, diesel: 24.03, rating: 4.6 },
      { name: 'BP Century City', distance: 3.7, petrol95: 24.62, petrol93: 24.29, diesel: 24.06, rating: 4.4 },
      { name: 'Caltex Claremont', distance: 4.2, petrol95: 24.58, petrol93: 24.25, diesel: 24.02, rating: 4.5 },
      { name: 'Total Constantia', distance: 5.1, petrol95: 24.61, petrol93: 24.28, diesel: 24.05, rating: 4.3 }
    ],
    'KwaZulu-Natal': [
      { name: 'Engen Umhlanga', distance: 2.1, petrol95: 24.68, petrol93: 24.35, diesel: 24.12, rating: 4.7 },
      { name: 'Shell Gateway', distance: 3.4, petrol95: 24.72, petrol93: 24.39, diesel: 24.16, rating: 4.5 },
      { name: 'BP Ballito', distance: 4.8, petrol95: 24.75, petrol93: 24.42, diesel: 24.19, rating: 4.6 },
      { name: 'Sasol Durban North', distance: 5.5, petrol95: 24.70, petrol93: 24.37, diesel: 24.14, rating: 4.4 },
      { name: 'Total Westville', distance: 6.2, petrol95: 24.73, petrol93: 24.40, diesel: 24.17, rating: 4.3 }
    ],
    'Eastern Cape': [
      { name: 'Engen Port Elizabeth', distance: 2.4, petrol95: 24.64, petrol93: 24.31, diesel: 24.08, rating: 4.5 },
      { name: 'Shell Walmer', distance: 3.2, petrol95: 24.68, petrol93: 24.35, diesel: 24.12, rating: 4.6 },
      { name: 'BP Summerstrand', distance: 4.1, petrol95: 24.71, petrol93: 24.38, diesel: 24.15, rating: 4.4 },
      { name: 'Caltex Newton Park', distance: 5.3, petrol95: 24.66, petrol93: 24.33, diesel: 24.10, rating: 4.5 },
      { name: 'Total Greenacres', distance: 6.0, petrol95: 24.69, petrol93: 24.36, diesel: 24.13, rating: 4.3 }
    ],
    'Free State': [
      { name: 'Engen Bloemfontein', distance: 2.7, petrol95: 24.81, petrol93: 24.48, diesel: 24.25, rating: 4.4 },
      { name: 'Shell Westdene', distance: 3.5, petrol95: 24.85, petrol93: 24.52, diesel: 24.29, rating: 4.5 },
      { name: 'BP Universitas', distance: 4.3, petrol95: 24.88, petrol93: 24.55, diesel: 24.32, rating: 4.3 },
      { name: 'Sasol Langenhovenpark', distance: 5.2, petrol95: 24.83, petrol93: 24.50, diesel: 24.27, rating: 4.6 },
      { name: 'Total Mimosa Mall', distance: 6.1, petrol95: 24.86, petrol93: 24.53, diesel: 24.30, rating: 4.4 }
    ],
    'Mpumalanga': [
      { name: 'Engen Nelspruit', distance: 2.2, petrol95: 24.87, petrol93: 24.54, diesel: 24.31, rating: 4.6 },
      { name: 'Shell Mbombela', distance: 3.0, petrol95: 24.91, petrol93: 24.58, diesel: 24.35, rating: 4.5 },
      { name: 'BP White River', distance: 4.5, petrol95: 24.94, petrol93: 24.61, diesel: 24.38, rating: 4.4 },
      { name: 'Caltex Hazyview', distance: 5.7, petrol95: 24.89, petrol93: 24.56, diesel: 24.33, rating: 4.7 },
      { name: 'Total Lydenburg', distance: 6.8, petrol95: 24.92, petrol93: 24.59, diesel: 24.36, rating: 4.3 }
    ],
    'Limpopo': [
      { name: 'Engen Polokwane', distance: 2.5, petrol95: 24.90, petrol93: 24.57, diesel: 24.34, rating: 4.5 },
      { name: 'Shell Bendor', distance: 3.3, petrol95: 24.94, petrol93: 24.61, diesel: 24.38, rating: 4.4 },
      { name: 'BP Tzaneen', distance: 4.9, petrol95: 24.97, petrol93: 24.64, diesel: 24.41, rating: 4.6 },
      { name: 'Sasol Mokopane', distance: 5.6, petrol95: 24.92, petrol93: 24.59, diesel: 24.36, rating: 4.5 },
      { name: 'Total Thohoyandou', distance: 6.4, petrol95: 24.95, petrol93: 24.62, diesel: 24.39, rating: 4.3 }
    ],
    'North West': [
      { name: 'Engen Rustenburg', distance: 2.6, petrol95: 24.83, petrol93: 24.50, diesel: 24.27, rating: 4.5 },
      { name: 'Shell Potchefstroom', distance: 3.4, petrol95: 24.87, petrol93: 24.54, diesel: 24.31, rating: 4.6 },
      { name: 'BP Klerksdorp', distance: 4.7, petrol95: 24.90, petrol93: 24.57, diesel: 24.34, rating: 4.4 },
      { name: 'Caltex Mahikeng', distance: 5.8, petrol95: 24.85, petrol93: 24.52, diesel: 24.29, rating: 4.5 },
      { name: 'Total Brits', distance: 6.3, petrol95: 24.88, petrol93: 24.55, diesel: 24.32, rating: 4.3 }
    ],
    'Northern Cape': [
      { name: 'Engen Kimberley', distance: 2.8, petrol95: 24.75, petrol93: 24.42, diesel: 24.19, rating: 4.4 },
      { name: 'Shell Upington', distance: 3.6, petrol95: 24.79, petrol93: 24.46, diesel: 24.23, rating: 4.5 },
      { name: 'BP Kuruman', distance: 4.8, petrol95: 24.82, petrol93: 24.49, diesel: 24.26, rating: 4.3 },
      { name: 'Caltex De Aar', distance: 5.9, petrol95: 24.77, petrol93: 24.44, diesel: 24.21, rating: 4.6 },
      { name: 'Total Springbok', distance: 6.7, petrol95: 24.80, petrol93: 24.47, diesel: 24.24, rating: 4.4 }
    ]
  };

  const nearbyStations = stationsByProvince[userLocation] || stationsByProvince['Gauteng'];

  // Price alerts system
  useEffect(() => {
    const checkPriceSpikes = () => {
      const latestPrice = priceHistory[priceHistory.length - 1].petrol95;
      const previousPrice = priceHistory[priceHistory.length - 2].petrol95;
      const percentageChange = ((latestPrice - previousPrice) / previousPrice) * 100;

      if (Math.abs(percentageChange) >= alertThreshold) {
        const newAlert = {
          id: Date.now(),
          type: percentageChange > 0 ? 'increase' : 'decrease',
          percentage: Math.abs(percentageChange).toFixed(2),
          timestamp: new Date().toLocaleString()
        };
        setPriceAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    };

    const interval = setInterval(checkPriceSpikes, 30000);
    return () => clearInterval(interval);
  }, [alertThreshold]);

  const getFuelTypeLabel = (type) => {
    const labels = {
      petrol95: 'Petrol 95',
      petrol93: 'Petrol 93',
      diesel: 'Diesel',
      coastal: 'Coastal Petrol'
    };
    return labels[type] || type;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-cyan-500 p-3 rounded-lg shadow-xl">
          <p className="text-cyan-400 font-semibold">{payload[0].payload.date}</p>
          <p className="text-white">R{payload[0].value.toFixed(2)}/L</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-3 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              SA Fuel Price Monitor
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Real-time fuel price tracking across South Africa</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <select 
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="bg-transparent text-white border-none outline-none cursor-pointer w-full sm:w-auto"
                >
                  {Object.keys(currentPrices).map(province => (
                    <option key={province} value={province} className="bg-gray-800">{province}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">Alerts</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 sm:gap-2 mb-6 bg-gray-800/30 p-1 rounded-lg backdrop-blur-sm overflow-x-auto">
          {['overview', 'stations', 'history', 'alerts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[80px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-base transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Prices Cards */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(currentPrices[userLocation]).filter(([key]) => key !== 'change').map(([type, price]) => (
                <div key={type} className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl border border-cyan-500/30 shadow-xl hover:shadow-cyan-500/20 transition-all">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">{getFuelTypeLabel(type)}</span>
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">R{price.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    {currentPrices[userLocation].change > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        <span className="text-red-400">+{currentPrices[userLocation].change}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        <span className="text-green-400">{currentPrices[userLocation].change}%</span>
                      </>
                    )}
                    <span className="text-gray-500 ml-1 hidden sm:inline">this week</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Price Trend</h2>
                <select 
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 outline-none cursor-pointer"
                >
                  <option value="petrol95">Petrol 95</option>
                  <option value="petrol93">Petrol 93</option>
                  <option value="diesel">Diesel</option>
                  <option value="coastal">Coastal Petrol</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[20, 26]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey={selectedFuelType} 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Recent Alerts
              </h2>
              <div className="space-y-3">
                {priceAlerts.length > 0 ? (
                  priceAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.type === 'increase' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        {alert.type === 'increase' ? (
                          <TrendingUp className="w-5 h-5 text-red-400 mt-0.5" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-green-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            alert.type === 'increase' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            Price {alert.type === 'increase' ? 'Spike' : 'Drop'} Alert
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {alert.percentage}% change detected
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent price alerts</p>
                    <p className="text-sm mt-1">You'll be notified of significant changes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Provincial Comparison */}
            <div className="lg:col-span-3 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Provincial Price Comparison (Petrol 95)</h2>
              <div className="space-y-3">
                {Object.entries(currentPrices)
                  .sort(([, a], [, b]) => a.petrol95 - b.petrol95)
                  .map(([province, data]) => (
                    <div key={province} className="flex items-center gap-4">
                      <div className="w-32 font-medium text-gray-300">{province}</div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                          style={{ width: `${((data.petrol95 - 24) / 1) * 100}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-end pr-3">
                          <span className="text-sm font-semibold text-white">R{data.petrol95.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-400" />
                  Nearby Fuel Stations
                </h2>
                <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                  <MapPin className="w-4 h-4" />
                  Find Stations
                </button>
              </div>
              <div className="space-y-4">
                {nearbyStations.map((station, idx) => (
                  <div key={idx} className="bg-gray-700/30 p-5 rounded-lg border border-gray-600 hover:border-cyan-500/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-white">{station.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {station.distance} km away
                          </span>
                          <span className="flex items-center gap-1">
                            ⭐ {station.rating}
                          </span>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                        Navigate
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-600">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Petrol 95</p>
                        <p className="text-lg font-bold text-cyan-400">R{station.petrol95.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Petrol 93</p>
                        <p className="text-lg font-bold text-cyan-400">R{station.petrol93.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Diesel</p>
                        <p className="text-lg font-bold text-cyan-400">R{station.diesel.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Price History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Petrol 95</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Petrol 93</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Diesel</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.slice().reverse().map((record, idx, arr) => {
                    const prevRecord = arr[idx + 1];
                    const change = prevRecord 
                      ? ((record.petrol95 - prevRecord.petrol95) / prevRecord.petrol95 * 100).toFixed(2)
                      : 0;
                    return (
                      <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-all">
                        <td className="py-4 px-4 font-medium">{record.date}</td>
                        <td className="py-4 px-4 text-right text-cyan-400 font-semibold">R{record.petrol95.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right text-cyan-400 font-semibold">R{record.petrol93.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right text-cyan-400 font-semibold">R{record.diesel.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right">
                          {change !== 0 && (
                            <span className={`inline-flex items-center gap-1 ${
                              change > 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {change > 0 ? '+' : ''}{change}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Alert Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Alert me when price changes by:
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-2xl font-bold text-cyan-400 w-20 text-right">
                      {alertThreshold}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-all">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-300">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-all">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-300">Push notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-all">
                    <input type="checkbox" className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-300">Weekly price summary</span>
                  </label>
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-lg font-semibold transition-all shadow-lg">
                  Save Alert Settings
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-cyan-500/30 shadow-xl">
              <h2 className="text-xl font-bold mb-6">Alert History</h2>
              <div className="space-y-3">
                {priceAlerts.length > 0 ? (
                  priceAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.type === 'increase' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        {alert.type === 'increase' ? (
                          <TrendingUp className="w-5 h-5 text-red-400 mt-0.5" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-green-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            alert.type === 'increase' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            Price {alert.type === 'increase' ? 'Increase' : 'Decrease'}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {alert.percentage}% change in Petrol 95
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No alerts yet</p>
                    <p className="text-sm mt-2">You'll see notifications here when prices change significantly</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-gray-400 text-sm md:text-base">
            © 2026 . All rights reserved by{' '}
            <span className="text-cyan-400 font-semibold">#thendo-makherana</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FuelPriceTracker;