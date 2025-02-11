import React from 'react'

interface QueryResult {
  columns: string[]
  rows: any[][]
}

interface QueryResultsProps {
  results: QueryResult | null
}

const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  if (!results) return null

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">Query Results</h2>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                {results.columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                  } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}
                >
                  {row.map((cell, jdx) => (
                    <td
                      key={jdx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300"
                    >
                      {cell?.toString() ?? 'null'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default QueryResults