import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../features/store';
import { setLoading, setError } from '../features/groups/groupsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    // TODO: Fetch groups from Firebase
    dispatch(setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Your Expense Groups</Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/create-group"
        >
          Create New Group
        </Button>
      </Box>

      <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
        {groups.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You haven't created any expense groups yet. Create one to get started!
          </Typography>
        ) : (
          groups.map((group) => (
            <Box key={group.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {group.description}
                  </Typography>
                  <Typography variant="body2">
                    Members: {group.members.length}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/group/${group.id}`}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default Home; 