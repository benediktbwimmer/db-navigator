import React, { useState } from 'react'

interface ConnectionInputProps {
  connStr: string
  onConnStrChange: (value: string) => void
  onFetchSchema: () => Promise<void>
}

const ConnectionInput: React.FC<ConnectionInputProps> = ({
  connStr,
  onConnStrChange,
  onFetchSchema
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchSchema = async () => {
    setIsLoading(true);
    try {
      await onFetchSchema();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <label className="block text-gray-700 dark:text-gray-200 text-base font-semibold mb-3">
        PostgreSQL Connection String
      </label>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <input
          type="text"
          value={connStr}
          onChange={(e) => onConnStrChange(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-gray-900 dark:text-gray-100"
          placeholder="postgresql://user:password@localhost:5432/dbname"
        />
        <button
          onClick={handleFetchSchema}
          disabled={isLoading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching Schema...
            </>
          ) : (
            'Fetch Schema'
          )}
        </button>
      </div>
    </div>
  )
}

export default ConnectionInput