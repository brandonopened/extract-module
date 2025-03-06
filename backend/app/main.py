from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from laiser.skill_extractor import Skill_Extractor
import pandas as pd
from typing import List, Optional
import json
from pydantic import BaseModel
import io

app = FastAPI(title="Skills Extractor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize skill extractor
skill_extractor = Skill_Extractor()

class ExtractRequest(BaseModel):
    text: str
    input_type: str = "job"  # "job", "syllabus", or "resume"

@app.post("/extract-skills")
async def extract_skills(request: ExtractRequest):
    try:
        # Create a DataFrame with the input text
        df = pd.DataFrame([{
            'id': '1',
            'description': request.text
        }])
        
        # Extract skills
        output = skill_extractor.extractor(
            df, 
            'id', 
            text_columns=['description'], 
            input_type=request.input_type
        )
        
        # Convert to dict for JSON response
        return output.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    input_type: str = "job"
):
    try:
        # Read the file content
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
        # Extract skills
        output = skill_extractor.extractor(
            df,
            'id' if 'id' in df.columns else df.columns[0],
            text_columns=['description'] if 'description' in df.columns else [df.columns[1]],
            input_type=input_type
        )
        
        return output.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 