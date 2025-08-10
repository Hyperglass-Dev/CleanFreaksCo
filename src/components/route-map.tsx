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
}

declare global {
  interface Window {
    google: any;
  }
}

export function RouteMap({ jobs, loading }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  useEffect(() => {
    setIsMapLoading(true);
    setMapError(null);
    
    loadGoogleMapsAPI()
      .then(() => {
        initializeMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        setMapError(`Failed to load Google Maps: ${error.message}`);
        setIsMapLoading(false);
      });
  }, []);

  useEffect(() => {
    if (map && jobs.length > 0) {
      calculateRoute();
    }
  }, [map, jobs]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: -33.8688, lng: 151.2093 }, // Sydney default
      mapTypeId: 'roadmap',
      mapId: '45d96433875fef9af3c0d13a', // Clean Freaks Co map styling
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
  };

  const calculateRoute = async () => {
    if (!directionsService || !directionsRenderer || jobs.length === 0) return;

    try {
      const jobsWithAddresses = jobs.filter(job => job.address);
      
      if (jobsWithAddresses.length === 0) return;

      if (jobsWithAddresses.length === 1) {
        // Single job - just center map on it
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: jobsWithAddresses[0].address }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            
            new window.google.maps.Marker({
              position: results[0].geometry.location,
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
          }
        });
        return;
      }

      // Multiple jobs - calculate route
      const waypoints = jobsWithAddresses.slice(1, -1).map(job => ({
        location: job.address,
        stopover: true
      }));

      const request = {
        origin: jobsWithAddresses[0].address,
        destination: jobsWithAddresses[jobsWithAddresses.length - 1].address,
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

  if (loading) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
          <CardDescription>Loading today's route...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading map...</div>
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
          ref={mapRef} 
          className="h-[400px] w-full rounded-lg border"
        />
        
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
