# Sustainity Backend Service

A Node.js backend service for handling sustainability data through CSV file uploads and processing.

## Features

- CSV file upload and processing
- Column mapping configuration
- Data preview functionality
- Asynchronous processing using Bull queue
- RESTful API endpoints
- PostgreSQL database integration
- Docker containerization

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 14+
- Redis

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following configuration:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sustainity
DB_USER=postgres
DB_PASSWORD=postgres
UPLOAD_DIR=./uploads
```

## Running with Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

## Running Locally

1. Start PostgreSQL and Redis
2. Create the database and tables using the schema in `src/models/schema.sql`
3. Run the application:
```bash
npm start
```

## API Endpoints

### File Upload and Processing

- `POST /api/upload/file` - Upload CSV file
  - Request: `multipart/form-data` with file field
  - Response: Filename and success message

- `POST /api/upload/process` - Process uploaded file
  - Request: JSON with filename and column mapping
  - Response: Processing status and mapping ID

- `GET /api/upload/preview/:filename` - Preview file contents
  - Response: First 10 rows of the CSV file

### Data Retrieval

- `GET /api/data` - Get all records (paginated)
  - Query parameters: page, limit
  - Response: Paginated data with metadata

- `GET /api/data/:id` - Get specific record
  - Response: Single record data

## Example Column Mapping

```json
{
  "Transaction Date": "date",
  "CO₂ Emissions (kg)": "emission_kg",
  "Energy Usage (kWh)": "energy_consumption_kwh",
  "Water Usage (L)": "water_usage_liters",
  "Waste Generated (kg)": "waste_kg",
  "Renewable Energy (%)": "renewable_energy_percentage",
  "Additional Notes": "notes"
}
```

## Error Handling

The application includes comprehensive error handling and logging:
- Input validation
- File type validation
- Database error handling
- Detailed error logging using Winston

## Testing

Run the test suite:
```bash
npm test
```

## License

MIT 