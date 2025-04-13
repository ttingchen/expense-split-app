import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { theme } from './theme';
import Layout from './components/Layout';
import Home from './components/Home';
import CreateGroup from './components/CreateGroup';
import GroupDetails from './components/GroupDetails';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-group" element={<CreateGroup />} />
              <Route path="/group/:groupId" element={<GroupDetails />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
