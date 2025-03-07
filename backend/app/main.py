from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# from laiser.skill_extractor import Skill_Extractor  # Comment out for now
import pandas as pd
from typing import List, Optional
import json
from pydantic import BaseModel
import io
from collections import defaultdict
import os
import random

app = FastAPI(title="Skills Extractor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the project root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize skill extractor
# skill_extractor = Skill_Extractor()  # Comment out for now

class ExtractRequest(BaseModel):
    text: str
    input_type: str = "job"  # "job", "syllabus", or "resume"

class SkillStats(BaseModel):
    skill: str
    jobCount: int
    syllabusCount: int
    resumeCount: int
    gapScore: float

@app.post("/upload-skills")
async def upload_skills(
    file: UploadFile = File(...),
    source: str = "custom"  # "job", "syllabus", "resume", or "custom"
):
    try:
        # Read the uploaded file
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Validate the file structure
        required_columns = ['Raw Skill']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail="CSV file must contain 'Raw Skill' column"
            )
        
        # Add missing columns if they don't exist
        if 'Correlation Coefficient' not in df.columns:
            df['Correlation Coefficient'] = 1.0
        if 'Research ID' not in df.columns:
            df['Research ID'] = [f'custom{i}' for i in range(len(df))]
            
        # Save the file with appropriate name
        output_path = os.path.join(PROJECT_ROOT, f'extracted_skills_for_custom_{source}.csv')
        df.to_csv(output_path, index=False)
        
        return {
            "message": "Skills uploaded successfully",
            "file_path": output_path,
            "skill_count": len(df)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/skills-stats")
async def get_skills_stats():
    try:
        # Initialize empty DataFrames
        jobs_df = pd.DataFrame()
        syllabi_df = pd.DataFrame()
        custom_jobs_df = pd.DataFrame()
        custom_syllabi_df = pd.DataFrame()
        
        # Read the CSV files using absolute paths
        files_to_read = {
            'jobs': os.path.join(PROJECT_ROOT, 'extracted_skills_for_2Jobs.csv'),
            'syllabi': os.path.join(PROJECT_ROOT, 'extracted_skills_for_2Syllabi.csv'),
            'custom_jobs': os.path.join(PROJECT_ROOT, 'extracted_skills_for_custom_job.csv'),
            'custom_syllabi': os.path.join(PROJECT_ROOT, 'extracted_skills_for_custom_syllabus.csv')
        }
        
        # Try to read each file if it exists
        for key, path in files_to_read.items():
            try:
                if os.path.exists(path):
                    if key == 'jobs':
                        jobs_df = pd.read_csv(path)
                    elif key == 'syllabi':
                        syllabi_df = pd.read_csv(path)
                    elif key == 'custom_jobs':
                        custom_jobs_df = pd.read_csv(path)
                    elif key == 'custom_syllabi':
                        custom_syllabi_df = pd.read_csv(path)
            except Exception as e:
                print(f"Warning: Could not read {key} file at {path}: {str(e)}")
        
        # Combine job data
        if not jobs_df.empty and not custom_jobs_df.empty:
            jobs_df = pd.concat([jobs_df, custom_jobs_df])
        elif not custom_jobs_df.empty:
            jobs_df = custom_jobs_df
            
        # Combine syllabi data
        if not syllabi_df.empty and not custom_syllabi_df.empty:
            syllabi_df = pd.concat([syllabi_df, custom_syllabi_df])
        elif not custom_syllabi_df.empty:
            syllabi_df = custom_syllabi_df
            
        # If both DataFrames are empty, return empty list
        if jobs_df.empty and syllabi_df.empty:
            return []
            
        # Group and count skills for jobs
        jobs_skills = pd.DataFrame()
        if not jobs_df.empty:
            jobs_skills = jobs_df.groupby('Raw Skill').agg({
                'Correlation Coefficient': 'mean',
                'Research ID': 'count'
            }).reset_index()
            
        # Group and count skills for syllabi
        syllabi_skills = pd.DataFrame()
        if not syllabi_df.empty:
            syllabi_skills = syllabi_df.groupby('Raw Skill').agg({
                'Correlation Coefficient': 'mean',
                'Research ID': 'count'
            }).reset_index()
        
        # Combine the data
        all_skills = set()
        if not jobs_skills.empty:
            all_skills.update(jobs_skills['Raw Skill'].tolist())
        if not syllabi_skills.empty:
            all_skills.update(syllabi_skills['Raw Skill'].tolist())
        
        skills_stats = []
        for skill in all_skills:
            job_count = 0
            syllabus_count = 0
            
            if not jobs_skills.empty:
                job_data = jobs_skills[jobs_skills['Raw Skill'] == skill]
                if not job_data.empty:
                    job_count = int(job_data['Research ID'].iloc[0])
                    
            if not syllabi_skills.empty:
                syllabus_data = syllabi_skills[syllabi_skills['Raw Skill'] == skill]
                if not syllabus_data.empty:
                    syllabus_count = int(syllabus_data['Research ID'].iloc[0])
            
            # Calculate gap score (ratio of job demand to educational supply)
            gap_score = (job_count / max(syllabus_count, 1)) if syllabus_count > 0 else job_count
            
            skills_stats.append({
                "skill": skill,
                "jobCount": job_count,
                "syllabusCount": syllabus_count,
                "resumeCount": 0,  # No resume data available yet
                "gapScore": gap_score
            })
        
        return skills_stats
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-skills")
async def extract_skills(request: ExtractRequest):
    try:
        # Extract common skills based on the input type
        common_skills = {
            "job": [
                "Python Programming",
                "Data Analysis",
                "Project Management",
                "Communication",
                "Problem Solving"
            ],
            "syllabus": [
                "Research Methods",
                "Critical Thinking",
                "Data Analysis",
                "Academic Writing",
                "Statistical Analysis"
            ],
            "resume": [
                "Team Leadership",
                "Project Management",
                "Communication",
                "Problem Solving",
                "Time Management"
            ]
        }
        
        # Get skills for the requested input type
        skills = common_skills.get(request.input_type, common_skills["job"])
        
        # For demonstration, assign random confidence scores
        extracted_skills = [
            {
                "skill": skill,
                "confidence": round(random.uniform(0.7, 0.98), 2),
                "source": "text"
            }
            for skill in skills
        ]
        
        # Sort by confidence score
        extracted_skills.sort(key=lambda x: x["confidence"], reverse=True)
        
        return extracted_skills
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    input_type: str = "job"
):
    try:
        # For now, return mock data
        return [{
            "skill": "Data Analysis",
            "confidence": 0.85,
            "source": "file"
        }]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 