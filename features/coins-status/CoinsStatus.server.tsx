import CoinsStatusClient from './CoinsStatus.client';
async function getAllCoins24hStatus() {
    try {
        // Server side
        const res = await fetch(
            'https://api.binance.com/api/v3/ticker/24hr',
            // { next: { revalidate: 60 } }, // cache 10 seconds
            { cache: 'no-store' },
        );

        const allCoinsData = await res.json();
        return allCoinsData;
    } catch (error) {
        // Return mock data on error
        console.log(error);
        return [];
    }
}

export default async function CoinsStatusServer() {
    const initialData = await getAllCoins24hStatus();
    return <CoinsStatusClient initialData={initialData} />;
}
