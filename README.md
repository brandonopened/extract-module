# Skills Extractor UI

A modern web application for extracting, analyzing, and comparing skills from job descriptions, course syllabi, and resumes.

## Features

- Extract skills from various sources:
  - Job descriptions
  - Course syllabi
  - Resumes
- Compare skills across different sources
- Visualize skill distribution and gaps
- Modern, responsive UI built with React and Material-UI
- Real-time skill extraction and analysis

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Setup

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Use the navigation menu to access different features:
   - Dashboard: Overview of extracted skills and recent activities
   - Extract Skills: Upload documents or enter text to extract skills
   - Compare Skills: Analyze and compare skills across different sources

## API Endpoints

- `POST /extract-skills`: Extract skills from text input
- `POST /upload-file`: Extract skills from uploaded CSV files
- `GET /health`: Check API health status

## Technologies Used

- Frontend:
  - React with TypeScript
  - Material-UI for components
  - Recharts for data visualization
  - React Query for data fetching
  - Vite for development and building

- Backend:
  - FastAPI
  - LAiSER Skill Extractor
  - Pandas for data processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
