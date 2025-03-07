import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SkillData {
  skill: string;
  jobCount: number;
  syllabusCount: number;
  resumeCount: number;
  gapScore: number;
}

const SkillsComparison = () => {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillsStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/skills-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch skills statistics');
        }
        const data = await response.json();
        setSkillsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsStats();
  }, []);

  const filteredSkills = selectedSource === 'all'
    ? skillsData
    : skillsData.filter(skill => {
        switch (selectedSource) {
          case 'jobs':
            return skill.jobCount > 0;
          case 'syllabi':
            return skill.syllabusCount > 0;
          case 'resumes':
            return skill.resumeCount > 0;
          default:
            return true;
        }
      });

  const getChipColor = (gapScore: number) => {
    if (gapScore > 1.2) return 'error';
    if (gapScore > 0.8) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Skills Comparison
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Source</InputLabel>
                <Select
                  value={selectedSource}
                  label="Filter by Source"
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  <MenuItem value="all">All Sources</MenuItem>
                  <MenuItem value="jobs">Job Postings</MenuItem>
                  <MenuItem value="syllabi">Course Syllabi</MenuItem>
                  <MenuItem value="resumes">Resumes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="h6" gutterBottom>
              Skills Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredSkills.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobCount" name="Job Postings" fill="#8884d8" />
                <Bar dataKey="syllabusCount" name="Course Syllabi" fill="#82ca9d" />
                <Bar dataKey="resumeCount" name="Resumes" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Most In-Demand Skills
            </Typography>
            <List>
              {filteredSkills
                .sort((a, b) => b.jobCount - a.jobCount)
                .slice(0, 10)
                .map((skill) => (
                  <ListItem key={skill.skill}>
                    <ListItemText
                      primary={skill.skill}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`Jobs: ${skill.jobCount}`}
                            size="small"
                            sx={{ mr: 1 }}
                            color="primary"
                          />
                          <Chip
                            label={`Courses: ${skill.syllabusCount}`}
                            size="small"
                            sx={{ mr: 1 }}
                            color="secondary"
                          />
                          {skill.resumeCount > 0 && (
                            <Chip
                              label={`Resumes: ${skill.resumeCount}`}
                              size="small"
                              color="default"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Skills Gap Analysis
            </Typography>
            <List>
              {filteredSkills
                .sort((a, b) => b.gapScore - a.gapScore)
                .slice(0, 10)
                .map((skill) => (
                  <ListItem key={skill.skill}>
                    <ListItemText
                      primary={skill.skill}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`Gap Score: ${skill.gapScore.toFixed(2)}`}
                            size="small"
                            color={getChipColor(skill.gapScore)}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {skill.jobCount} jobs / {skill.syllabusCount} courses
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillsComparison; 