import React, { useState, useMemo } from 'react'

interface Schema {
  tables: {
    [key: string]: Array<{ column_name: string; data_type: string }>
  }
}

interface SchemaViewerProps {
  schema: Schema | null
  rowCounts: { [key: string]: number }
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema, rowCounts }) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredAndSortedTables = useMemo(() => {
    if (!schema || !searchQuery.trim()) {
      return Object.keys(schema?.tables || {})
    }

    const query = searchQuery.toLowerCase()
    const tables = Object.keys(schema.tables)
    
    return tables.sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      
      // Both match table name exactly
      if (aLower.includes(query) && bLower.includes(query)) {
        return aLower.indexOf(query) - bLower.indexOf(query)
      }
      
      // Only a matches table name
      if (aLower.includes(query)) return -1
      // Only b matches table name
      if (bLower.includes(query)) return 1
      
      // Check for column matches
      const aColumnMatch = schema.tables[a].some(col => 
        col.column_name.toLowerCase().includes(query)
      )
      const bColumnMatch = schema.tables[b].some(col => 
        col.column_name.toLowerCase().includes(query)
      )
      
      // Both have matching columns
      if (aColumnMatch && bColumnMatch) return 0
      // Only a has matching column
      if (aColumnMatch) return -1
      // Only b has matching column
      if (bColumnMatch) return 1
      
      return 0
    }).filter(table => {
      const hasTableMatch = table.toLowerCase().includes(query)
      const hasColumnMatch = schema.tables[table].some(col => 
        col.column_name.toLowerCase().includes(query)
      )
      return hasTableMatch || hasColumnMatch
    })
  }, [schema, searchQuery])

  if (!schema) return null

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-900">{part}</span>
      ) : part
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">Database Schema</h2>
      
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tables and columns..."
          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="grid gap-6">
        {filteredAndSortedTables.map((table) => (
          <div key={table} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between text-lg mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
              <span>{highlightMatch(table)}</span>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1.5 px-4 rounded-full shadow-sm">
                {rowCounts[table] || 0} rows
              </span>
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {schema.tables[table].map((col) => (
                  <li
                    key={col.column_name}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <span className="font-medium">{highlightMatch(col.column_name)}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-400">
                      {col.data_type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchemaViewer