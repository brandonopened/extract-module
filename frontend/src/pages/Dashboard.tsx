import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Dashboard: React.FC = () => {
  const pieData = [
    { name: 'Job Skills', value: 300 },
    { name: 'Course Skills', value: 200 },
    { name: 'Resume Skills', value: 150 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Job Analysis',
      description: 'Analyzed 50 job postings in Data Science',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'Course Analysis',
      description: 'Processed 25 course syllabi from Computer Science',
      timestamp: '5 hours ago',
    },
    {
      id: 3,
      type: 'Resume Analysis',
      description: 'Analyzed 10 resumes from recent graduates',
      timestamp: '1 day ago',
    },
  ];

  const stats = [
    {
      title: 'Total Skills Analyzed',
      value: '650',
    },
    {
      title: 'Unique Skills',
      value: '245',
    },
    {
      title: 'Documents Processed',
      value: '85',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h3" component="div">
                {stat.value}
              </Typography>
              <Typography color="text.secondary">{stat.title}</Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.type}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {activity.description}
                          </Typography>
                          {' — '}
                          {activity.timestamp}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Skills Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {pieData.map((entry, index) => (
                <Box
                  key={entry.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: COLORS[index % COLORS.length],
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {entry.name}: {entry.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 