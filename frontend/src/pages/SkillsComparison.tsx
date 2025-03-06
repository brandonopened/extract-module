import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
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

interface SkillMatch {
  skill: string;
  jobCount: number;
  syllabusCount: number;
  resumeCount: number;
}

const SkillsComparison: React.FC = () => {
  const [matchedSkills] = useState<SkillMatch[]>([
    {
      skill: 'Python Programming',
      jobCount: 15,
      syllabusCount: 8,
      resumeCount: 12,
    },
    {
      skill: 'Data Analysis',
      jobCount: 20,
      syllabusCount: 10,
      resumeCount: 8,
    },
    {
      skill: 'Machine Learning',
      jobCount: 12,
      syllabusCount: 6,
      resumeCount: 4,
    },
  ]);

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Skills Comparison
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={matchedSkills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="jobCount"
                  name="Job Postings"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="syllabusCount"
                  name="Course Syllabi"
                  fill="#82ca9d"
                />
                <Bar
                  dataKey="resumeCount"
                  name="Resumes"
                  fill="#ffc658"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Most In-Demand Skills
            </Typography>
            <List>
              {matchedSkills
                .sort((a, b) => b.jobCount - a.jobCount)
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
                          />
                          <Chip
                            label={`Courses: ${skill.syllabusCount}`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`Resumes: ${skill.resumeCount}`}
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills Gap Analysis
            </Typography>
            <List>
              {matchedSkills
                .sort(
                  (a, b) =>
                    b.jobCount / (b.syllabusCount + b.resumeCount) -
                    a.jobCount / (a.syllabusCount + a.resumeCount)
                )
                .map((skill) => (
                  <ListItem key={skill.skill}>
                    <ListItemText
                      primary={skill.skill}
                      secondary={`Gap Score: ${(
                        skill.jobCount /
                        (skill.syllabusCount + skill.resumeCount)
                      ).toFixed(2)}`}
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