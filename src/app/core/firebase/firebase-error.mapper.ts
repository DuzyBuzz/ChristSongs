import { FirebaseError } from 'firebase/app';

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/account-exists-with-different-credential': 'This Google account is already linked with another sign-in method.',
  'auth/cancelled-popup-request': 'Another sign-in window is already open. Complete it or close it before trying again.',
  'auth/network-request-failed': 'The request failed because the device appears to be offline.',
  'auth/operation-not-allowed': 'Google sign-in is not enabled in Firebase Authentication for this project.',
  'auth/popup-blocked': 'The Google sign-in window was blocked before it could open.',
  'auth/popup-closed-by-user': 'The Google sign-in window was closed before authentication completed.',
  'auth/too-many-requests': 'Too many authentication attempts were made. Try again shortly.',
  'auth/unauthorized-domain': 'This domain is not allowed for Google sign-in. Add it to Firebase Authentication authorized domains.',
  'permission-denied': 'This action is not allowed for the current account.',
  unavailable: 'Firebase is temporarily unavailable. Please try again.',
};

export function mapFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return (
      FIREBASE_ERROR_MESSAGES[error.code]
      ?? `Firebase error (${error.code}). Please check app auth configuration and try again.`
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}