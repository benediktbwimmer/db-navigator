import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

interface SQLEditorProps {
  userRequest: string
  onUserRequestChange: (value: string) => void
  generatedSQL: string
  onGeneratedSQLChange: (value: string | undefined) => void
  onGenerateSQL: () => void
  onExecuteSQL: () => void
}

const SQLEditor: React.FC<SQLEditorProps> = ({
  userRequest,
  onUserRequestChange,
  generatedSQL,
  onGeneratedSQLChange,
  onGenerateSQL,
  onExecuteSQL
}) => {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">Generate SQL Query</h2>
      <div className="mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <textarea
            value={userRequest}
            onChange={(e) => onUserRequestChange(e.target.value)}
            placeholder="Describe your query in natural language..."
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px] transition-all duration-200 shadow-sm text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={onGenerateSQL}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            Generate SQL
          </button>
        </div>
      </div>

      {generatedSQL && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">SQL Editor</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <div className="border dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
              <Editor
                height="200px"
                language="sql"
                value={generatedSQL}
                onChange={onGeneratedSQLChange}
                theme={isDark ? 'vs-dark' : 'vs-light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
            <button
              onClick={onExecuteSQL}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              Execute SQL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SQLEditor