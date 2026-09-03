import { PermissionsAndroid, Platform } from 'react-native';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyBeGZHlLJ9zoKsrB_W60MmYlumItxaZrmI';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodedAddress {
  fullAddress: string;
  shortLocation: string;
  city: string;
  state: string;
  postalCode?: string;
  coordinates: Coordinates;
}

export const CITY_COORDINATES: Record<string, Coordinates> = {
  'Patna Junction, Patna': { latitude: 25.6022, longitude: 85.1376 },
  'Bailey Road, Patna': { latitude: 25.6121, longitude: 85.1054 },
  'Kankarbagh, Patna': { latitude: 25.5921, longitude: 85.1584 },
  'Boring Road, Patna': { latitude: 25.6174, longitude: 85.1189 },
  'Patna Airport (PAT)': { latitude: 25.5913, longitude: 85.0880 },
  'Gaya Junction, Gaya': { latitude: 24.8055, longitude: 85.0068 },
  'Muzaffarpur City': { latitude: 26.1209, longitude: 85.3647 },
  'Bhagalpur Station': { latitude: 25.2425, longitude: 86.9842 },
  'Darbhanga Airport': { latitude: 26.1971, longitude: 85.9184 },
  'Connaught Place, New Delhi': { latitude: 28.6315, longitude: 77.2167 },
  'IGI Airport T3, New Delhi': { latitude: 28.5562, longitude: 77.1000 },
  'Sector 18, Noida': { latitude: 28.5708, longitude: 77.3260 },
  'Hazratganj, Lucknow': { latitude: 26.8500, longitude: 80.9500 },
  'Charbagh Station, Lucknow': { latitude: 26.8300, longitude: 80.9200 },
  'Varanasi Cantt, Varanasi': { latitude: 25.3267, longitude: 82.9867 },
  'Ranchi Main Road': { latitude: 23.3441, longitude: 85.3096 },
  'Koramangala, Bengaluru': { latitude: 12.9352, longitude: 77.6245 },
  'Andheri East, Mumbai': { latitude: 19.1136, longitude: 72.8697 },
  'Salt Lake, Kolkata': { latitude: 22.5868, longitude: 88.4178 },
};

export const getCityCoordinates = (cityName: string): Coordinates => {
  if (CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }
  // Default to Patna
  return { latitude: 25.6022, longitude: 85.1376 };
};

/**
 * Request OS Location Permission (Android / iOS)
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'GaadiMitra Location Access',
          message:
            'GaadiMitra needs your live GPS location to find nearby verified drivers and vehicles for quick ride booking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow GPS',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission request error:', err);
      return false;
    }
  }

  return false;
};

/**
 * Reverse Geocode GPS coordinates using Google Geocoding API with MAP_KEY
 */
export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number
): Promise<GeocodedAddress> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const components = firstResult.address_components || [];

      let sublocality = '';
      let locality = '';
      let administrativeArea = '';
      let postalCode = '';

      for (const comp of components) {
        const types: string[] = comp.types || [];
        if (types.includes('sublocality') || types.includes('neighborhood')) {
          sublocality = comp.long_name;
        } else if (types.includes('locality')) {
          locality = comp.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          administrativeArea = comp.long_name;
        } else if (types.includes('postal_code')) {
          postalCode = comp.long_name;
        }
      }

      const primaryArea = sublocality || locality || 'Current Location';
      const cityOrState = locality || administrativeArea || 'Patna';
      const shortLocation = `${primaryArea}, ${cityOrState}`;

      return {
        fullAddress: firstResult.formatted_address || shortLocation,
        shortLocation,
        city: locality || cityOrState,
        state: administrativeArea,
        postalCode,
        coordinates: { latitude, longitude },
      };
    }
  } catch (error) {
    console.warn('Google Reverse Geocoding API error:', error);
  }

  // Fallback if network/offline
  return {
    fullAddress: 'Patna Junction, Patna, Bihar, India',
    shortLocation: 'Patna Junction, Patna',
    city: 'Patna',
    state: 'Bihar',
    coordinates: { latitude, longitude },
  };
};

/**
 * Get device current location with GPS permission check and reverse geocoding
 */
export const detectCurrentLocationWithGps = async (): Promise<GeocodedAddress> => {
  const hasPermission = await requestLocationPermission();

  return new Promise((resolve) => {
    const nav = (typeof globalThis !== 'undefined' ? (globalThis as any) : {}) as any;
    if (hasPermission && nav && nav.navigator && nav.navigator.geolocation) {
      nav.navigator.geolocation.getCurrentPosition(
        async (pos: { coords: { latitude: number; longitude: number } }) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const address = await reverseGeocodeCoordinates(lat, lng);
          resolve(address);
        },
        async (error: any) => {
          console.warn('GPS position error, using default Patna coords:', error);
          const defaultCoords = { latitude: 25.6022, longitude: 85.1376 };
          const address = await reverseGeocodeCoordinates(defaultCoords.latitude, defaultCoords.longitude);
          resolve(address);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    } else {
      // Fallback to default
      const defaultCoords = { latitude: 25.6022, longitude: 85.1376 };
      reverseGeocodeCoordinates(defaultCoords.latitude, defaultCoords.longitude).then(resolve);
    }
  });
};

/**
 * Builds Google Static Map URL with user location & driver markers
 */
export const buildGoogleStaticMapUrl = (
  center: Coordinates,
  drivers: { latitude: number; longitude: number; label?: string }[],
  zoom = 14,
  width = 600,
  height = 400
): string => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const sizeParam = `size=${width}x${height}&scale=2`;
  const centerParam = `center=${center.latitude},${center.longitude}&zoom=${zoom}`;
  const mapTypeParam = 'maptype=roadmap';

  // User location marker (Blue)
  const userMarker = `markers=color:blue%7Clabel:U%7C${center.latitude},${center.longitude}`;

  // Drivers markers (Red/Orange)
  const driverMarkers = drivers
    .map(
      (d, i) =>
        `markers=color:red%7Clabel:${d.label || (i + 1)}%7C${d.latitude},${d.longitude}`
    )
    .join('&');

  const keyParam = `key=${GOOGLE_MAPS_API_KEY}`;

  return `${baseUrl}?${centerParam}&${sizeParam}&${mapTypeParam}&${userMarker}&${driverMarkers}&${keyParam}`;
};
