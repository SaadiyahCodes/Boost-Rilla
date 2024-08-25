import React, { useEffect, useState } from 'react';
import { addComment, getComments, editComment, deleteComment } from './apiService';

const sampleTranscript = 
`Sales Agent: Hello, how can I help you today?
Customer: I have an issue with my order.
Sales Agent: Can you please provide more details?
Customer: I received the wrong item.`;

interface Comment {
    id: string; // Add an id for updating and deleting comments
    text: string;
    start: number;
    end: number;
    transcriptId: number;
    user: string;
}

const TranscriptViewer: React.FC = () => {
    const transcriptId = 1; // Set your transcriptId here or get it dynamically
    const [transcript, setTranscript] = useState(sampleTranscript);
    const [comments, setComments] = useState<Comment[]>([]);
    const [highlighted, setHighlighted] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            const loadedComments = await getComments(transcriptId); // Fetch comments by transcriptId
            setComments(loadedComments);
        };

        fetchComments();
    }, [transcriptId]);

    const handleTextSelection = async () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const { startOffset, endOffset } = range;
            const text = selection.toString();
            setHighlighted(text);

            const commentText = prompt('Enter your comment:', '');
            if (commentText) {
                // Create new comment object
                const newComment = {
                    text: commentText,
                    start: startOffset,
                    end: endOffset,
                    transcriptId: transcriptId,
                    user: 'user-id', // Replace with actual user identifier
                    id: '', // This will be handled by the backend
                };

                try {
                    // Add comment to the backend
                    const addedComment = await addComment(newComment);
                    // Update comments state with the new comment
                    setComments(prev => [...prev, addedComment]);
                } catch (error) {
                    console.error('Failed to add comment:', error);
                }
            }
            // Remove the selection highlight
            selection.removeAllRanges();
            // Reset highlighted state
            setHighlighted(null);
        }
    };

    const getHighlightedTranscript = () => {
        let result = [];
        let lastIndex = 0;

        comments.forEach((comment) => {
            result.push(transcript.slice(lastIndex, comment.start));
            result.push(
                <mark key={comment.id}>{transcript.slice(comment.start, comment.end)}</mark>
            );
            lastIndex = comment.end;
        });

        result.push(transcript.slice(lastIndex));

        return result;
    };

    const handleEditComment = async (index: number) => {
        const newText = prompt('Edit your comment:', comments[index].text);
        if (newText !== null) {
            const updatedComment = {
                ...comments[index],
                text: newText
            };

            try {
                await editComment(comments[index].id, { text: newText });
                setComments(prev =>
                    prev.map((comment, i) =>
                        i === index ? updatedComment : comment
                    )
                );
            } catch (error) {
                console.error('Failed to edit comment:', error);
            }
        }
    };

    const handleDeleteComment = async (index: number) => {
        try {
            await deleteComment(comments[index].id);
            setComments(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <div>
            <h2>Transcript</h2>
            <pre onMouseUp={handleTextSelection}>
                {getHighlightedTranscript()}
            </pre>
            <h3>Comments</h3>
            <ul>
                {comments.map((comment, index) => (
                    <li key={comment.id}>
                        <span>Highlighted Text: {transcript.slice(comment.start, comment.end)}</span>
                        <span> - Comment: {comment.text}</span>
                        <button onClick={() => handleEditComment(index)}>Edit</button>
                        <button onClick={() => handleDeleteComment(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TranscriptViewer;
