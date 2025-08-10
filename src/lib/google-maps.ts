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
    console.log('Google Maps already loaded');
    return Promise.resolve();
  }

  // Start loading if not already in progress
  if (!isLoading) {
    isLoading = true;
    
    loadPromise = new Promise((resolve, reject) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      console.log('Loading Google Maps API with key:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey) {
        isLoading = false;
        loadPromise = null;
        reject(new Error('Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.'));
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log('Google Maps script already in DOM, waiting for load...');
        // Wait a bit for it to load
        const checkLoaded = () => {
          if (window.google?.maps) {
            isLoading = false;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded, waiting for API to initialize...');
        // Wait for Google Maps API to be fully available
        const checkMapReady = () => {
          if (window.google?.maps?.Map) {
            console.log('Google Maps API fully loaded and ready');
            isLoading = false;
            resolve();
          } else {
            console.log('Waiting for Google Maps API...');
            setTimeout(checkMapReady, 100);
          }
        };
        checkMapReady();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        isLoading = false;
        loadPromise = null;
        reject(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
    });
  }

  return loadPromise!;
};

export const isGoogleMapsLoaded = (): boolean => {
  return !!window.google?.maps;
};
