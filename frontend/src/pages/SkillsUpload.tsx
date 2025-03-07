import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SkillsUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<string>('job');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSourceChange = (event: any) => {
    setSource(event.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('source', source);

    try {
      const response = await fetch('http://localhost:8000/upload-skills', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload skills');
      }

      const data = await response.json();
      setSuccess(`Successfully uploaded ${data.skill_count} skills!`);
      setSelectedFile(null);
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading the file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload Skills List
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Upload a CSV file containing a list of skills. The file must have a 'Raw Skill' column.
          Optionally, you can include 'Correlation Coefficient' and 'Research ID' columns.
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="source-label">Source Type</InputLabel>
          <Select
            labelId="source-label"
            value={source}
            label="Source Type"
            onChange={handleSourceChange}
          >
            <MenuItem value="job">Job Posting</MenuItem>
            <MenuItem value="syllabus">Course Syllabus</MenuItem>
            <MenuItem value="resume">Resume</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            fullWidth
          >
            Select CSV File
            <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileChange} />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default SkillsUpload; 