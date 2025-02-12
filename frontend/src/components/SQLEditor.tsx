import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

interface SQLEditorProps {
  userRequest: string
  onUserRequestChange: (value: string) => void
  generatedSQL: string
  onGeneratedSQLChange: (value: string | undefined) => void
  onGenerateSQL: () => Promise<void>
  onExecuteSQL: () => Promise<void>
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches)
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleGenerateSQL = async () => {
    setIsGenerating(true)
    try {
      await onGenerateSQL()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExecuteSQL = async () => {
    setIsExecuting(true)
    try {
      await onExecuteSQL()
    } finally {
      setIsExecuting(false)
    }
  }

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
            onClick={handleGenerateSQL}
            disabled={isGenerating || !userRequest.trim()}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating SQL...
              </>
            ) : (
              'Generate SQL'
            )}
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
              onClick={handleExecuteSQL}
              disabled={isExecuting || !generatedSQL.trim()}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing SQL...
                </>
              ) : (
                'Execute SQL'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SQLEditor