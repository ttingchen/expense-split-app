import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createGroup, getGroups, getGroup } from '../../firebase/config';
import { DocumentData } from 'firebase/firestore';

export interface Member {
  id: string;
  name: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  createdAt: string;
}

interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  error: string | null;
}

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async () => {
    const groups = await getGroups();
    return groups as Group[];
  }
);

export const fetchGroup = createAsyncThunk(
  'groups/fetchGroup',
  async (groupId: string) => {
    const group = await getGroup(groupId);
    return group as Group;
  }
);

export const createNewGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData: Omit<Group, 'id' | 'createdAt'>) => {
    const groupId = await createGroup(groupData);
    return { id: groupId, ...groupData, createdAt: new Date().toISOString() } as Group;
  }
);

const initialState: GroupsState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    addMember: (state, action) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group) {
        group.members.push(action.payload.member);
      }
    },
    removeMember: (state, action) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group) {
        group.members = group.members.filter(m => m.id !== action.payload.memberId);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch groups';
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      });
  },
});

export const { setCurrentGroup, addMember, removeMember, setLoading, setError } = groupsSlice.actions;
export default groupsSlice.reducer; 