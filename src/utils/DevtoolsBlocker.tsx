'use client';

import { useEffect } from 'react';

export default function DevtoolsBlocker() {
  useEffect(() => {
    // Check if the environment is production
    if (process.env.NODE_ENV === 'production') {
      const closeTab = () => {
        // Try to close tab (works only if script opened it)
        const win = window.open('', '_self');
        win?.close();

        // If browser blocks close, redirect immediately
        document.body.innerHTML = '<h1 style="text-align:center;margin-top:50vh;">Access Denied</h1>';
        window.location.href = 'https://google.com';
      };

      const detectDevToolsOpen = () => {
        const threshold = 160;
        const isOpen =
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold;

        if (isOpen) {
          closeTab();
        }
      };

      const blockContextMenu = (e: MouseEvent) => e.preventDefault();

      const blockKeys = (e: KeyboardEvent) => {
        // Prevent common shortcuts for opening DevTools
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
          (e.ctrlKey && e.key.toUpperCase() === 'U')
        ) {
          e.preventDefault();
          closeTab(); // Attempt to close tab immediately if the key is pressed
        }
      };

      // Check immediately after page load
      detectDevToolsOpen();

      // Keep checking every 500ms to detect DevTools if opened after page load
      const interval = setInterval(detectDevToolsOpen, 500);

      // Event listeners to block right-click and certain key combinations
      document.addEventListener('contextmenu', blockContextMenu);
      document.addEventListener('keydown', blockKeys);

      // Cleanup on unmount
      return () => {
        document.removeEventListener('contextmenu', blockContextMenu);
        document.removeEventListener('keydown', blockKeys);
        clearInterval(interval);
      };
    }
  }, []);

  return null;
}
