# DB Navigator

DB Navigator is an interactive SQL query builder that uses natural language processing to help you explore and query PostgreSQL databases. With an intuitive user interface, it allows you to describe your query in plain English and generates the corresponding SQL code.

## Features

- 🔌 Easy database connection management
- 📊 Visual database schema explorer with table structure and row counts
- 💬 Natural language to SQL query generation
- ⚡ Interactive SQL editor with syntax highlighting
- 🌓 Dark mode support
- 📋 Clean tabular results display

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/db-navigator.git
cd db-navigator
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the frontend directory:
```env
VITE_POSTGRES_CONN_STR=postgresql://user:password@localhost:5432/dbname
```

2. Configure your database connection string as needed.

### Running the Application

1. Start the backend server:
```bash
cd backend
python main.py
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter your PostgreSQL connection string
2. Click "Fetch Schema" to load your database structure
3. Enter a natural language description of your query
4. Click "Generate SQL" to convert your description into SQL
5. Review and optionally modify the generated SQL
6. Click "Execute SQL" to run the query and see the results

## Development

The project is built with:

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Monaco Editor for SQL editing
- Vite as the build tool

### Backend
- Python with FastAPI
- SQLAlchemy for database interactions
- LLM integration for natural language processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.