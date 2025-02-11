import React from 'react'

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
  if (!schema) return null

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">Database Schema</h2>
      <div className="grid gap-6">
        {Object.keys(schema.tables).map((table) => (
          <div key={table} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between text-lg mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
              <span>{table}</span>
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
                    <span className="font-medium">{col.column_name}</span>
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