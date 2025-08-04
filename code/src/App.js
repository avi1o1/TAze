import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import './App.css'; // Ensure you have Tailwind CSS imported

function App() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState(null);

  // Google Sheets configuration from environment variables
  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const RANGE = 'A2:E';

  // Load data from Google Sheets
  const loadFromGoogleSheets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }

      const data = await response.json();

      if (data.values) {
        const queuesData = data.values.map(
          ([title, description, ticketValue, turnValue], index) => ({
            id: index + 1,
            title: title || 'Untitled',
            description: description || 'No description',
            nextTicket: parseInt(ticketValue) || 1,
            currentTurn: parseInt(turnValue) || 0,
          })
        );
        setQueues(queuesData);
        setLastSync(new Date());
      }
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFromGoogleSheets();

    const interval = setInterval(() => {
      loadFromGoogleSheets();
    }, 15000); // Auto-reload every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-black mb-3">Turn Ticket System</h1>
          <p className="text-lg text-gray-700">Effortless Queue Management for Paper Showing</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6 flex items-center shadow-md">
            <AlertCircle className="w-6 h-6 text-red-700 mr-3 flex-shrink-0" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Sync Status */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className={`w-6 h-6 mr-3 ${loading ? 'animate-spin text-blue-700' : 'text-gray-700'}`} />
            <span className="text-gray-800 font-medium">
              {loading ? 'Syncing...' : 'Google Sheets Connected'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {lastSync && (
              <span className="text-sm text-gray-500 italic">
                Last sync: {lastSync.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadFromGoogleSheets}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Queues Cards */}
        <div className="space-y-6">
          {queues.map((queue) => {
            const waitingCount = Math.max(0, queue.nextTicket - queue.currentTurn - 1);
            return (
              <div
                key={queue.id}
                className="bg-white rounded-lg shadow-md p-6 border hover:shadow-xl hover:scale-105 transition-transform"
              >
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{queue.title}</h2>
                  <p className="text-sm text-gray-600">{queue.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Now Serving</p>
                    <p className="text-3xl font-extrabold text-blue-600">
                      {queue.currentTurn.toString().padStart(3, '0')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Next Ticket</p>
                    <p className="text-3xl font-extrabold text-green-600">
                      {queue.nextTicket.toString().padStart(3, '0')}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${100 - (waitingCount / queue.nextTicket)*100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {waitingCount} waiting in line
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;