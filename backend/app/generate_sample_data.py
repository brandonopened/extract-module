import pandas as pd
import os

# Get the project root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Sample job skills data
jobs_data = {
    'Raw Skill': ['Python Programming', 'Data Analysis', 'Machine Learning', 'SQL', 'Communication'],
    'Correlation Coefficient': [0.95, 0.90, 0.85, 0.88, 0.92],
    'Research ID': ['job1', 'job1', 'job2', 'job2', 'job1']
}

# Sample syllabus skills data
syllabi_data = {
    'Raw Skill': ['Python Programming', 'Data Analysis', 'Statistics', 'SQL', 'Research Methods'],
    'Correlation Coefficient': [0.92, 0.88, 0.90, 0.85, 0.89],
    'Research ID': ['syl1', 'syl1', 'syl2', 'syl1', 'syl2']
}

# Create DataFrames
jobs_df = pd.DataFrame(jobs_data)
syllabi_df = pd.DataFrame(syllabi_data)

# Save to CSV files
jobs_output_path = os.path.join(PROJECT_ROOT, 'extracted_skills_for_2Jobs.csv')
syllabi_output_path = os.path.join(PROJECT_ROOT, 'extracted_skills_for_2Syllabi.csv')

jobs_df.to_csv(jobs_output_path, index=False)
syllabi_df.to_csv(syllabi_output_path, index=False)

print(f"Generated sample data files:")
print(f"Jobs data saved to: {jobs_output_path}")
print(f"Syllabi data saved to: {syllabi_output_path}") 