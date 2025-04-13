import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createGroup } from '../features/groups/groupsSlice';
import { v4 as uuidv4 } from 'uuid';

interface MemberInput {
  name: string;
  email: string;
}

const CreateGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<MemberInput[]>([{ name: '', email: '' }]);

  const handleAddMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof MemberInput, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createGroup({
      name,
      description,
      members: members
        .filter(m => m.name && m.email)
        .map(m => ({ ...m, id: uuidv4() })),
    }));
    navigate('/');
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        Create New Expense Group
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={2}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Members
                </Typography>
                <Stack spacing={2}>
                  {members.map((member, index) => (
                    <Stack direction="row" spacing={2} key={index} alignItems="center">
                      <TextField
                        fullWidth
                        label="Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        required
                      />
                      {members.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveMember(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMember}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Add Member
                </Button>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create Group
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateGroup; 