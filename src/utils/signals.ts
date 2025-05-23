import { signal, effect } from '@preact/signals-react';
import { useAuthContext } from '../contexts/context';
import api from '../services/api';

// Signal for triggered actions
const triggeredAction = signal<string | null>(null);

export const useSecurityEnforcement = () => {
  const { signOut } = useAuthContext();

  const handleViolation = async (action: string) => {
    triggeredAction.value = action;

    // Sign out the user
    signOut();

    // Clear the session on the server
    try {
      await api.delete('/delSessions');
    } catch (error) {
      console.error('Error clearing session on logout:', error);
    }

    // Redirect to error page
    window.location.href = `/error?action=${encodeURIComponent(action)}`;
  };

  effect(() => {
    const action = triggeredAction.value;
    if (action) {
      console.log(`Triggered violation: ${action}`); // Optional debugging
    }
  });

  // Attach global event listeners
  const disableContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    handleViolation('Right-click');
  };

  const disableCopyPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    handleViolation('Copy-Paste');
  };

  const preventDevTools = () => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
      handleViolation('Dev Tools');
    }
  };

  // Add event listeners and cleanup
  effect(() => {
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('paste', disableCopyPaste);
    const devToolsInterval = setInterval(preventDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('copy', disableCopyPaste);
      document.removeEventListener('paste', disableCopyPaste);
      clearInterval(devToolsInterval);
    };
  });
};
