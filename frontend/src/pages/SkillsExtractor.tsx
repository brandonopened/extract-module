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
  CircularProgress,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import { Extension as ExtractIcon } from '@mui/icons-material';

const SkillsExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState('job');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<Array<{ skill: string; confidence: number }>>([]);

  const handleInputTypeChange = (event: any) => {
    setInputType(event.target.value);
    setError(null);
  };

  const handleExtract = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to extract skills from');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          input_type: inputType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to extract skills');
      }

      const data = await response.json();
      setExtractedSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while extracting skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Extract Skills from Text
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Paste your job description, course syllabus, or resume text below to extract relevant skills.
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="input-type-label">Source Type</InputLabel>
          <Select
            labelId="input-type-label"
            value={inputType}
            label="Source Type"
            onChange={handleInputTypeChange}
          >
            <MenuItem value="job">Job Posting</MenuItem>
            <MenuItem value="syllabus">Course Syllabus</MenuItem>
            <MenuItem value="resume">Resume</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Enter text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleExtract}
          disabled={loading || !inputText.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <ExtractIcon />}
          fullWidth
        >
          {loading ? 'Extracting Skills...' : 'Extract Skills'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {extractedSkills.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Extracted Skills
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {extractedSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.skill} (${(skill.confidence * 100).toFixed(0)}%)`}
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SkillsExtractor; 