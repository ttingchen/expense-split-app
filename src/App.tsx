import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import GroupList from './components/GroupList';
import GroupDetails from './components/GroupDetails';
import CreateGroup from './components/CreateGroup';
import Login from './components/Login';

const App = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/"
              element={user ? <GroupList /> : <Navigate to="/login" />}
            />
            <Route
              path="/create-group"
              element={user ? <CreateGroup /> : <Navigate to="/login" />}
            />
            <Route
              path="/group/:groupId"
              element={user ? <GroupDetails /> : <Navigate to="/login" />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
