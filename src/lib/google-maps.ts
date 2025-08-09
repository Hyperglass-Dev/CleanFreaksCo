// Shared Google Maps API loader to prevent duplicate loading

declare global {
  interface Window {
    google: any;
    googleMapsPromise?: Promise<void>;
  }
}

let isLoading = false;
let loadPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Return resolved promise if already loaded
  if (window.google?.maps) {
    return Promise.resolve();
  }

  // Start loading if not already in progress
  if (!isLoading) {
    isLoading = true;
    
    loadPromise = new Promise((resolve, reject) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        reject(new Error('Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        isLoading = false;
        resolve();
      };
      
      script.onerror = () => {
        isLoading = false;
        loadPromise = null;
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  }

  return loadPromise!;
};

export const isGoogleMapsLoaded = (): boolean => {
  return !!window.google?.maps;
};
