import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { RootState } from '../features/store';
import { addExpense, deleteExpense } from '../features/expenses/expensesSlice';
import { setCurrentGroup } from '../features/groups/groupsSlice';
import { Group, Expense, User } from '../types';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.groups);
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    paidBy: '',
  });

  useEffect(() => {
    if (groupId) {
      dispatch(setCurrentGroup(groupId));
    }
  }, [dispatch, groupId]);

  if (!currentGroup) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Group not found</Typography>
      </Box>
    );
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) return;

    dispatch(addExpense({
      groupId: currentGroup.id,
      description: newExpense.description,
      amount: newExpense.amount,
      paidBy: newExpense.paidBy,
      date: new Date().toISOString(),
      splitBetween: currentGroup.members.map(m => m.id),
    }));

    setNewExpense({
      description: '',
      amount: 0,
      paidBy: '',
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    dispatch(deleteExpense(expenseId));
  };

  const groupExpenses = expenses.filter(expense => expense.groupId === currentGroup.id);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">{currentGroup.name}</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Groups
        </Button>
      </Box>

      <Stack spacing={3}>
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Expense
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Paid By"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                  >
                    <option value="">Select a user</option>
                    {currentGroup.members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </TextField>
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddExpense}
                      disabled={!newExpense.description || !newExpense.amount || !newExpense.paidBy}
                    >
                      Add Expense
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Group Members
              </Typography>
              <List>
                {currentGroup.members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText
                      primary={member.name}
                      secondary={member.email}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expenses
              </Typography>
              {groupExpenses.length === 0 ? (
                <Typography>No expenses yet</Typography>
              ) : (
                <List>
                  {groupExpenses.map((expense) => (
                    <Box key={expense.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={expense.description}
                          secondary={`$${expense.amount} - Paid by ${
                            currentGroup.members.find(m => m.id === expense.paidBy)?.name
                          }`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default GroupDetails; 