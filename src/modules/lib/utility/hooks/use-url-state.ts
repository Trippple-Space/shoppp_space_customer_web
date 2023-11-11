import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useUrlState = () => {
    const router = useRouter();
    const [urlState, setUrlState] = useState({});

    useEffect(() => {
        const updateUrlState = () => {
            const queryParams = router.query;
            setUrlState(queryParams);
        };

        updateUrlState();

        const handleRouteChange = () => {
            updateUrlState();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return { urlState, setUrlState };
};
