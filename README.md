# Skills Extractor Application

A web application for extracting, comparing, and analyzing skills from various sources including job postings, course syllabi, and resumes.

## Features

- Extract skills from text (job descriptions, course syllabi, resumes)
- Upload custom skills lists via CSV
- Compare skills across different sources
- Browse and search through extracted skills
- Analyze skill gaps between job market demands and educational offerings

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## Project Structure

```
extract-module/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py   # Main application file
│   │   └── ...
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

### Start the Backend Server

1. Make sure you're in the backend directory with the virtual environment activated
2. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will be available at `http://localhost:8000`

### Start the Frontend Development Server

1. In a new terminal, navigate to the frontend directory
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Using the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Use the navigation menu to access different features:
   - **Extract Skills**: Paste text from job descriptions, syllabi, or resumes to extract skills
   - **Upload Skills**: Upload CSV files containing custom skills lists
   - **Compare Skills**: View and compare skills from different sources
   - **Browse Skills**: Search and filter through all extracted skills

### CSV Upload Format

When uploading custom skills, your CSV file should have the following format:

```csv
Raw Skill
Python Programming
Data Analysis
Machine Learning
```

Optional columns:
- `Correlation Coefficient`: Confidence score (0-1)
- `Research ID`: Unique identifier for the skill source

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development

### Backend Development

The backend is built with:
- FastAPI - Modern Python web framework
- Pandas - Data manipulation and analysis
- CORS middleware for cross-origin requests

### Frontend Development

The frontend is built with:
- React - UI library
- Material-UI - Component library
- React Router - Navigation
- React Query - Data fetching and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
