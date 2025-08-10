'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, MapPin } from 'lucide-react';
import type { Job } from '@/lib/types';
import { loadGoogleMapsAPI } from '@/lib/google-maps';

interface RouteMapProps {
  jobs: Job[];
  loading: boolean;
  staffAddress?: string; // For daily planning from staff home address
}

declare global {
  interface Window {
    google: any;
  }
}

export function RouteMap({ jobs, loading, staffAddress }: RouteMapProps) {
  console.log('RouteMap props:', { jobsCount: jobs.length, loading, staffAddress });
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Initialize map when container is available
  useEffect(() => {
    console.log('RouteMap useEffect triggered', { mapContainer: !!mapContainer, map: !!map, jobs: jobs.length });
    if (mapContainer && !map) {
      console.log('Starting map initialization...');
      setIsMapLoading(true);
      setMapError(null);
      
      loadGoogleMapsAPI()
        .then(() => {
          console.log('Google Maps API loaded, initializing map...');
          initializeMapWithContainer(mapContainer);
        })
        .catch((error) => {
          console.error('Failed to load Google Maps:', error);
          setMapError(`Failed to load Google Maps: ${error.message}`);
          setIsMapLoading(false);
        });
    }
  }, [mapContainer, map]);



  useEffect(() => {
    if (map && jobs.length > 0) {
      calculateRoute();
    }
  }, [map, jobs]);

  const initializeMapWithContainer = (container: HTMLDivElement) => {
    if (!container || !window.google?.maps) {
      console.error('Map container or Google Maps API not available');
      setMapError('Map initialization failed');
      setIsMapLoading(false);
      return;
    }

    console.log('Initializing Google Maps with container:', container);

    try {
      const mapInstance = new window.google.maps.Map(container, {
        zoom: 12,
        center: { lat: -33.8688, lng: 151.2093 }, // Sydney default
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        draggable: true,
        panel: null,
        markerOptions: {
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#800000',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2
          }
        }
      });

      directionsRendererInstance.setMap(mapInstance);
      
      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
      setIsMapLoading(false);
      setMapError(null);
      
      console.log('Google Maps initialized successfully');
      
      // Try to get user's current location
      getUserLocation();
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(`Failed to initialize map: ${error}`);
      setIsMapLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          console.log('User location obtained:', location);
          
          // Update map center to user location
          if (map) {
            map.setCenter(location);
            map.setZoom(13);
            
            // Add user location marker
            new window.google.maps.Marker({
              position: location,
              map: map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2
              }
            });
          }
        },
        (error) => {
          console.warn('Could not get user location:', error);
          // Default to Sydney if geolocation fails
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const calculateRoute = async () => {
    if (!directionsService || !directionsRenderer || jobs.length === 0) return;

    try {
      const jobsWithAddresses = jobs.filter(job => job.address);
      
      if (jobsWithAddresses.length === 0) return;

      // Clear previous routes
      directionsRenderer.setDirections({routes: []});

      if (jobsWithAddresses.length === 1) {
        // Single job - show route from user location or just center on job
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: jobsWithAddresses[0].address }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const jobLocation = results[0].geometry.location;
            
            // Add job marker
            new window.google.maps.Marker({
              position: jobLocation,
              map: map,
              title: jobsWithAddresses[0].clientName,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#800000',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2
              }
            });

            // If we have staff address or user location, show route to job
            const routeOrigin = staffAddress || userLocation;
            if (routeOrigin) {
              const request = {
                origin: routeOrigin,
                destination: jobLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.METRIC
              };

              directionsService.route(request, (result: any, status: any) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(result);
                  
                  const leg = result.routes[0].legs[0];
                  setRouteInfo({
                    distance: leg.distance.text,
                    duration: leg.duration.text
                  });
                } else {
                  console.error('Single job directions failed:', status);
                }
              });
            } else {
              // No user location, just center on job
              map.setCenter(jobLocation);
              map.setZoom(15);
            }
          }
        });
        return;
      }

      // Multiple jobs - calculate optimized route
      let origin;
      let waypoints = [];
      let destination = jobsWithAddresses[jobsWithAddresses.length - 1].address;

      // Prioritize staff address for daily planning, then user location, then first job
      if (staffAddress) {
        // Start from staff home address for daily planning
        origin = staffAddress;
        waypoints = jobsWithAddresses.slice(0, -1).map(job => ({
          location: job.address,
          stopover: true
        }));
      } else if (userLocation) {
        // Start from user location, visit all jobs
        origin = userLocation;
        waypoints = jobsWithAddresses.slice(0, -1).map(job => ({
          location: job.address,
          stopover: true
        }));
      } else {
        // Start from first job, visit middle jobs, end at last job
        waypoints = jobsWithAddresses.slice(1, -1).map(job => ({
          location: job.address,
          stopover: true
        }));
        origin = jobsWithAddresses[0].address;
      }

      const request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        unitSystem: window.google.maps.UnitSystem.METRIC
      };

      directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          
          // Calculate total distance and duration
          let totalDistance = 0;
          let totalDuration = 0;
          
          result.routes[0].legs.forEach((leg: any) => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });

          setRouteInfo({
            distance: `${(totalDistance / 1000).toFixed(1)} km`,
            duration: `${Math.ceil(totalDuration / 60)} min`
          });
        } else {
          console.error('Directions request failed due to:', status);
        }
      });
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const openInGoogleMaps = () => {
    if (jobs.length === 0) return;
    
    const addresses = jobs.filter(job => job.address).map(job => job.address);
    if (addresses.length === 0) return;

    let url = 'https://www.google.com/maps/dir/';
    url += addresses.map(addr => encodeURIComponent(addr)).join('/');
    window.open(url, '_blank');
  };

  console.log('RouteMap render state:', { loading, isMapLoading, mapError, jobsLength: jobs.length });
  
  if (loading || isMapLoading) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
          <CardDescription>Loading route map...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
          <CardDescription>Map Error</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-red-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load map</p>
              <p className="text-sm mt-1">{mapError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  setMapError(null);
                  setIsMapLoading(true);
                  loadGoogleMapsAPI().then(() => {
                    if (mapContainer) initializeMapWithContainer(mapContainer);
                  }).catch(error => {
                    console.error('Retry failed:', error);
                    setMapError(`Retry failed: ${error.message}`);
                    setIsMapLoading(false);
                  });
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
          <CardDescription>No jobs to route today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Add jobs to see route optimization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Optimized Route</CardTitle>
            <CardDescription>
              {jobs.length} job{jobs.length > 1 ? 's' : ''} for today
              {staffAddress && <span className="block text-xs mt-1">Starting from staff home address</span>}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openInGoogleMaps}
            className="gap-2"
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={setMapContainer}
          className="h-[400px] w-full rounded-lg border bg-gray-100"
          style={{ minHeight: '400px' }}
        />
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-blue-50 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>API Key: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Set' : 'Missing'}</p>
            <p>Google Maps Loaded: {window.google?.maps ? 'Yes' : 'No'}</p>
            <p>Map Instance: {map ? 'Created' : 'Not created'}</p>
            <p>User Location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Not available'}</p>
            <p>Jobs Count: {jobs.length}</p>
            <p>Container: {mapContainer ? 'Available' : 'Not available'}</p>
          </div>
        )}
        
        {routeInfo && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <Badge variant="secondary">{routeInfo.distance}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <Badge variant="secondary">{routeInfo.duration}</Badge>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Job Sequence:</h4>
          {jobs.map((job, index) => (
            <div key={job.id} className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                {index + 1}
              </Badge>
              <div>
                <span className="font-medium">{job.clientName}</span>
                <div className="text-muted-foreground text-xs">{job.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
