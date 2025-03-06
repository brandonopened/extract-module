import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';

const API_URL = 'http://localhost:8000';

interface Skill {
  id: string;
  skill: string;
  confidence: number;
  source: string;
}

const SkillsExtractor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState('job');
  const [extractedSkills, setExtractedSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  const extractMutation = useMutation({
    mutationFn: async (data: { text: string; input_type: string }) => {
      const response = await fetch(`${API_URL}/extract-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to extract skills');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setExtractedSkills(data);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('input_type', inputType);

      const response = await fetch(`${API_URL}/upload-file`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setExtractedSkills(data);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleExtract = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to extract skills from');
      return;
    }
    extractMutation.mutate({ text: inputText, input_type: inputType });
  };

  const columns = [
    { field: 'skill', headerName: 'Skill', flex: 1 },
    { field: 'confidence', headerName: 'Confidence', width: 130 },
    { field: 'source', headerName: 'Source', width: 130 },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Extract Skills
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Input Type</InputLabel>
              <Select
                value={inputType}
                label="Input Type"
                onChange={(e) => setInputType(e.target.value)}
              >
                <MenuItem value="job">Job Description</MenuItem>
                <MenuItem value="syllabus">Course Syllabus</MenuItem>
                <MenuItem value="resume">Resume</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Enter text to extract skills from"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleExtract}
              disabled={extractMutation.isPending}
              sx={{ mr: 2 }}
            >
              {extractMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                'Extract Skills'
              )}
            </Button>

            <Button
              variant="outlined"
              component="label"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                'Upload CSV'
              )}
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {extractedSkills.length > 0 && (
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={extractedSkills}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Paper>
      )}
    </Box>
  );
};

export default SkillsExtractor; 