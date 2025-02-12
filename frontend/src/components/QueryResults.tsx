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

  const downloadAsCSV = () => {
    if (!results) return
    const csvContent = [
      results.columns.join(','),
      ...results.rows.map(row => row.map(cell => 
        cell === null ? '' : `"${cell.toString().replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'query_results.csv'
    link.click()
  }

  const downloadAsJSON = () => {
    if (!results) return
    const jsonData = results.rows.map(row => {
      const obj: Record<string, any> = {}
      results.columns.forEach((col, idx) => {
        obj[col] = row[idx]
      })
      return obj
    })
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'query_results.json'
    link.click()
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Query Results</h2>
        <div className="space-x-2">
          <button
            onClick={downloadAsCSV}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            Export CSV
          </button>
          <button
            onClick={downloadAsJSON}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            Export JSON
          </button>
        </div>
      </div>
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