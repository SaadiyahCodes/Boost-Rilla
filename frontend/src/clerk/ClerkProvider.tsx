// src/clerk/ClerkProviderComponent.tsx
import React from 'react';
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import ClerkSignIn from './ClerkSignIn';
import ClerkSignUp from './ClerkSignUp';

const clerkPublishableKey = process.env.REACT_APP_CLERK_FRONTEND_API;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const ClerkProviderComponent: React.FC = () => {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<ClerkSignIn />} />
          <Route path="/sign-up" element={<ClerkSignUp />} />
          <Route path="/" element={<App />} />
          <Route path="*" element={<RedirectToSignIn />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default ClerkProviderComponent;