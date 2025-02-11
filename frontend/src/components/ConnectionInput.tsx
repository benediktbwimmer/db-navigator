import React from 'react'

interface ConnectionInputProps {
  connStr: string
  onConnStrChange: (value: string) => void
  onFetchSchema: () => void
}

const ConnectionInput: React.FC<ConnectionInputProps> = ({
  connStr,
  onConnStrChange,
  onFetchSchema
}) => {
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
          onClick={onFetchSchema}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
        >
          Fetch Schema
        </button>
      </div>
    </div>
  )
}

export default ConnectionInput