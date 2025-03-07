import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface Skill {
  skill: string;
  jobCount: number;
  syllabusCount: number;
  resumeCount: number;
  gapScore: number;
}

const SkillsBrowser = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:8000/skills-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    switch (filter) {
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

  const getConfidenceColor = (score: number) => {
    if (score > 1.2) return 'error';
    if (score > 0.8) return 'warning';
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
        Skills Browser
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Skills"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Source</InputLabel>
              <Select
                value={filter}
                label="Filter by Source"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Sources</MenuItem>
                <MenuItem value="jobs">Job Postings</MenuItem>
                <MenuItem value="syllabi">Course Syllabi</MenuItem>
                <MenuItem value="resumes">Resumes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell align="right">Job Postings</TableCell>
                <TableCell align="right">Course Syllabi</TableCell>
                <TableCell align="right">Gap Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSkills
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((skill) => (
                  <TableRow key={skill.skill}>
                    <TableCell component="th" scope="row">
                      {skill.skill}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={skill.jobCount}
                        size="small"
                        color={skill.jobCount > 0 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={skill.syllabusCount}
                        size="small"
                        color={skill.syllabusCount > 0 ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={skill.gapScore.toFixed(2)}
                        size="small"
                        color={getConfidenceColor(skill.gapScore)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredSkills.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default SkillsBrowser; 