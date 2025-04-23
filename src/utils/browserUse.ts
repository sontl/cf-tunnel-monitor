/**
 * Opens a URL in the browser
 * @param url The URL to open in the browser
 * @returns A promise that resolves when the URL is opened
 */
export const openUrlInBrowser = async (url: string): Promise<void> => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // For client-side usage, open in a new tab
      window.open(url, '_blank');
      return Promise.resolve();
    } else {
      // For server-side or automated usage, call our automation server
      const serverUrl = import.meta.env.VITE_AUTOMATION_SERVER_URL || 'http://localhost:3001';
      const response = await fetch(`${serverUrl}/open-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to open URL: ${errorData.error || response.statusText}`);
      }

      return Promise.resolve();
    }
  } catch (error) {
    console.error('Error opening URL in browser:', error);
    throw error;
  }
}; 