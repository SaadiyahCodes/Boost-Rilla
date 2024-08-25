// src/App.tsx
import React from 'react';
import './App.css';
import TranscriptViewer from './TranscriptViewer';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Transcript Management</h1>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>
        <TranscriptViewer />
      </main>
    </div>
  );
}

export default App;
