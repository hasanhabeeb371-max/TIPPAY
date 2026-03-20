import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface LocationData {
  lat: number;
  lng: number;
}

interface LocationContextType {
  userLocation: LocationData | null;
  isDetecting: boolean;
  detectLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        setIsDetecting(false);
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      toast.success("Location detected successfully!");
    } catch (error) {
      console.error("Error detecting location:", error);
      toast.error("Failed to detect location. Please check your permissions.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <LocationContext.Provider value={{ userLocation, isDetecting, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocationContext must be used within LocationProvider");
  return context;
};
