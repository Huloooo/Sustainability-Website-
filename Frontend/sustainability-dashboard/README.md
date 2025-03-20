# Sustainability Dashboard

A modern web application for visualizing and analyzing sustainability-related data. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 CSV file upload and preview
- 📈 Interactive data visualization with charts
- 🔍 Dynamic filtering and sorting capabilities
- 📱 Responsive design for all devices
- ⚡ Real-time data processing

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- PapaParse for CSV parsing
- Headless UI for accessible components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
sustainability-dashboard/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable components
│   ├── lib/              # Utility functions
│   └── page.tsx          # Main page
├── public/               # Static assets
└── types/               # TypeScript type definitions
```

## Development Approach

1. **File Upload & Preview**
   - Implemented using PapaParse for CSV parsing
   - Preview shows first 10 rows with column headers
   - Real-time validation and error handling

2. **Data Visualization**
   - Interactive tables with sorting and filtering
   - Dynamic charts using Recharts
   - Responsive layout for all screen sizes

3. **User Experience**
   - Clean, modern UI with Tailwind CSS
   - Loading states and error feedback
   - Accessible components with Headless UI

## Challenges & Solutions

1. **Large Dataset Handling**
   - Implemented pagination and lazy loading
   - Optimized data processing for better performance

2. **Responsive Design**
   - Used Tailwind's responsive classes
   - Implemented mobile-first approach

3. **Type Safety**
   - Comprehensive TypeScript types
   - Runtime type checking for CSV data 