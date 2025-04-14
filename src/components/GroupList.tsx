import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../features/store';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { fetchGroups, selectGroups, Group, Member } from '../features/groups/groupsSlice';
import { RootState } from '../features/store';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const GroupList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const groups = useSelector(selectGroups);
  const loading = useSelector((state: RootState) => state.groups.loading);
  const currentUser = auth.currentUser;

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading groups...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Expense Groups</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-group')}
          >
            Create New Group
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      <Stack spacing={3}>
        {groups.length === 0 ? (
          <Typography>No groups yet. Create your first group!</Typography>
        ) : (
          groups.map((group: Group) => (
            <Card
              key={group.id}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  {group.createdBy === currentUser?.uid && (
                    <Chip label="Created by you" size="small" color="primary" />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {group.description}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {group.members.length} members
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Joined {new Date(group.members.find((m: Member) => m.id === currentUser?.uid)?.joinedAt || '').toLocaleDateString()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default GroupList; 