import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faLightbulb, 
  faPaperPlane, 
  faRobot, 
  faSpinner, 
  faExclamationTriangle, 
  faRedo, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState({ connected: false, isMock: false })

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const res = await fetch('/health')
      const data = await res.json()
      setApiStatus({ connected: true, isMock: !data.openaiConfigured })
    } catch (err) {
      setApiStatus({ connected: false, isMock: true })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data)
      } else {
        setError(data.response || 'Failed to get response from AI')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const retryQuery = () => {
    if (prompt.trim()) {
      handleSubmit({ preventDefault: () => {} })
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="text-white text-xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PromptQuery UI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Ask me anything and get AI-powered responses</p>
        </header>

        <main className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
                  Your Question
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything... What's the weather like? How do I make pasta? Explain quantum physics in simple terms..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={!prompt.trim() || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {response && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                  <FontAwesomeIcon icon={faRobot} className="text-blue-500" />
                  AI Response
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {new Date(response.timestamp).toLocaleString()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    response.isMock 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {response.isMock ? 'Demo Mode' : 'AI Response'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {response.response}
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="mb-4">
                <FontAwesomeIcon icon={faSpinner} className="fa-spin text-4xl text-blue-500" />
              </div>
              <p className="text-gray-600 font-medium">AI is thinking...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={retryQuery}
                  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <FontAwesomeIcon icon={faRedo} />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 text-center">
          <div className="space-y-4">
            <p className="text-gray-500 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faInfoCircle} />
              Built with Express.js, OpenAI API, and React
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                apiStatus.connected 
                  ? apiStatus.isMock 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                  : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-500">
                {apiStatus.connected 
                  ? apiStatus.isMock 
                    ? 'Demo Mode (No API Key)' 
                    : 'OpenAI API Connected'
                  : 'Server Unavailable'
                }
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App 