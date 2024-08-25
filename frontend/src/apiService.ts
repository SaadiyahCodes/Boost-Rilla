import axios from 'axios';

interface CommentData {
  id: string;
  text: string;
  start: number;
  end: number;
  transcriptId: number;
  user: string;
}

const api = axios.create({
  baseURL: '/api',
});

export const getComments = async (transcriptId: number) => {
  const response = await api.get(`/comments?transcriptId=${transcriptId}`);
  return response.data;
};

export const addComment = async (commentData: CommentData) => {
  const response = await api.post('/comments', commentData);
  return response.data;
};

export const editComment = async (id: string, update: Partial<Pick<CommentData, 'text'>>) => {
  const response = await api.put(`/comments/${id}`, update);
  return response.data;
};

export const deleteComment = async (id: string) => {
  await api.delete(`/comments/${id}`);
};

export const getNextTranscriptId = async () => {
  const response = await api.get('/nextTranscriptId');
  return response.data;
};



// Add other API functions similarly
