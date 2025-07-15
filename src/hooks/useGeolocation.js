import { useState, useEffect } from 'react';

const useGeolocation = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const success = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
        };

        const failure = (err) => {
            setError(err.message);
        };

        navigator.geolocation.getCurrentPosition(success, failure);

        // Optional: Watch for location changes
        const watchId = navigator.geolocation.watchPosition(success, failure);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return { location, error };
};

export default useGeolocation;