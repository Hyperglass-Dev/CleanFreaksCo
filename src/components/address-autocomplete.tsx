'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { loadGoogleMapsAPI } from '@/lib/google-maps';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter address...",
  className,
  id,
  required 
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => {
        initializeAutocomplete();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps for autocomplete:', error);
      });

    return () => {
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'au' }, // Restrict to Australia
        fields: ['formatted_address', 'address_components', 'geometry'],
        mapId: '45d96433875fef9af3c0d13a' // Clean Freaks Co map styling
      }
    );

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    setAutocomplete(autocompleteInstance);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      id={id}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
      required={required}
      autoComplete="off"
    />
  );
}
