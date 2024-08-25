import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db } from './firebase/firebaseConfig.js'; // Import Firestore instance
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Firestore methods

// Initialize Express app
const app = express(); // Initialize Express app correctly
app.use(cors());
app.use(bodyParser.json());

let nextTranscriptId = 1; // This should be managed in a persistent way

app.get('/api/nextTranscriptId', (req, res) => {
    res.json(nextTranscriptId++);
});

// Route to fetch all comments by transcriptId
app.get('/api/comments', async (req, res) => {
    const transcriptId = parseInt(req.query.transcriptId);
    
    try {
        const commentsSnapshot = await getDocs(collection(db, 'comments'));
        const comments = commentsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(comment => comment.transcriptId === transcriptId); // Filter by transcriptId
        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).send('Error fetching comments');
    }
});

// Route to add a new comment
app.post('/api/comments', async (req, res) => {
    const { user, text, transcriptId, start, end } = req.body;

    try {
        const newComment = await addDoc(collection(db, 'comments'), {
            user,
            text,
            transcriptId,
            start,
            end,
            timestamp: new Date(),
        });
        res.status(201).json({ id: newComment.id });
    } catch (err) {
        console.error('Error saving comment:', err);
        res.status(500).send('Error saving comment');
    }
});

// Route to update an existing comment
app.put('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const commentRef = doc(db, 'comments', id);
        await updateDoc(commentRef, { text });
        res.status(200).send('Comment updated');
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).send('Error updating comment');
    }
});

// Route to delete a comment
app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const commentRef = doc(db, 'comments', id);
        await deleteDoc(commentRef);
        res.status(204).send(); // No content response on successful deletion
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).send('Error deleting comment');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// llm integration
/*
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateSummary = async (transcript) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Summarize the following transcript: ${transcript}`,
    max_tokens: 150,
  });
  return response.data.choices[0].text.trim();
};
*/