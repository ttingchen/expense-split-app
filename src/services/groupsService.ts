import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Group, Member } from '../features/groups/groupsSlice';

const groupsCollection = collection(db, 'groups');

export const createGroup = async (group: Omit<Group, 'id' | 'createdAt'>) => {
  const newGroup = {
    ...group,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(groupsCollection, newGroup);
  return { ...newGroup, id: docRef.id };
};

export const updateGroup = async (groupId: string, updates: Partial<Group>) => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, updates);
};

export const deleteGroup = async (groupId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  await deleteDoc(groupRef);
};

export const getGroups = async (userId: string) => {
  const q = query(groupsCollection, where('members', 'array-contains', { id: userId }));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Group[];
};

export const addMember = async (groupId: string, member: Member) => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(member),
  });
};

export const removeMember = async (groupId: string, memberId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  const group = await getDoc(groupRef);
  if (group.exists()) {
    const members = group.data().members;
    const updatedMembers = members.filter((m: Member) => m.id !== memberId);
    await updateDoc(groupRef, { members: updatedMembers });
  }
};

export const subscribeToGroups = (userId: string, callback: (groups: Group[]) => void) => {
  const q = query(groupsCollection, where('members', 'array-contains', { id: userId }));
  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Group[];
    callback(groups);
  });
}; 