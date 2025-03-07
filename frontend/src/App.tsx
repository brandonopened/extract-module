import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Extension as ExtractIcon,
  Compare as CompareIcon,
  List as ListIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import SkillsExtractor from './pages/SkillsExtractor'
import SkillsComparison from './pages/SkillsComparison'
import SkillsBrowser from './pages/SkillsBrowser'
import SkillsUpload from './pages/SkillsUpload'

const drawerWidth = 240;

const Dashboard = () => (
  <Box p={3}>
    <Typography variant="h4" gutterBottom>
      Skills Extractor Dashboard
    </Typography>
    <Typography paragraph>
      Welcome to the Skills Extractor Dashboard. This tool helps you:
    </Typography>
    <ul>
      <li>Extract skills from job descriptions, course syllabi, and resumes</li>
      <li>Compare skills across different sources</li>
      <li>Browse and search through all extracted skills</li>
      <li>Analyze skill gaps and trends</li>
      <li>Generate insights for curriculum development and career planning</li>
    </ul>
  </Box>
);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Extract Skills', icon: <ExtractIcon />, path: '/extract' },
    { text: 'Compare Skills', icon: <CompareIcon />, path: '/compare' },
    { text: 'Browse Skills', icon: <ListIcon />, path: '/browse' },
    { text: 'Upload Skills', icon: <CloudUploadIcon />, path: '/upload' }
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Skills Extractor
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <Toolbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/extract" element={<SkillsExtractor />} />
                <Route path="/compare" element={<SkillsComparison />} />
                <Route path="/browse" element={<SkillsBrowser />} />
                <Route path="/upload" element={<SkillsUpload />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App
