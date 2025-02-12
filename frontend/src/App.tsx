import React, { useState } from 'react'
import ConnectionInput from './components/ConnectionInput'
import SchemaViewer from './components/SchemaViewer'
import SQLEditor from './components/SQLEditor'
import QueryResults from './components/QueryResults'

interface Schema {
  tables: {
    [key: string]: Array<{ column_name: string; data_type: string }>
  }
}

interface QueryResult {
  columns: string[]
  rows: any[][]
}

const App: React.FC = () => {
  const [connStr, setConnStr] = useState<string>(
    import.meta.env.VITE_POSTGRES_CONN_STR || ''
  )
  const [schema, setSchema] = useState<Schema | null>(null)
  const [rowCounts, setRowCounts] = useState<{ [key: string]: number }>({})
  const [userRequest, setUserRequest] = useState<string>('')
  const [generatedSQL, setGeneratedSQL] = useState<string>('')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)

  const fetchSchema = async () => {
    const response = await fetch('/api/schema')
    if (!response.ok) {
      throw new Error('Failed to fetch schema')
    }
    const data = await response.json()
    setSchema(data.schema)
    setRowCounts(data.row_counts)
  }

  const generateSQL = async () => {
    const payload = {
      user_request: userRequest,
      selected_tables: schema ? Object.keys(schema.tables) : []
    }
    const response = await fetch('/api/generate-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      throw new Error('Failed to generate SQL')
    }
    const data = await response.json()
    setGeneratedSQL(data.sql_query)
  }

  const executeSQL = async () => {
    const response = await fetch('/api/execute-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: generatedSQL })
    })
    if (!response.ok) {
      throw new Error('Failed to execute SQL')
    }
    const data = await response.json()
    setQueryResult(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DB Navigator</h1>
        </div>
      </nav>
      
      <main className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-10">
            <ConnectionInput
              connStr={connStr}
              onConnStrChange={setConnStr}
              onFetchSchema={fetchSchema}
            />
            <SchemaViewer schema={schema} rowCounts={rowCounts} />
          </div>
          
          <div className="space-y-10">
            <SQLEditor
              userRequest={userRequest}
              onUserRequestChange={setUserRequest}
              generatedSQL={generatedSQL}
              onGeneratedSQLChange={(value) => setGeneratedSQL(value || '')}
              onGenerateSQL={generateSQL}
              onExecuteSQL={executeSQL}
            />
            <QueryResults results={queryResult} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
