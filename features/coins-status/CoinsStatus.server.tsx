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
        // console.log(error);
        return [];
    }
}

export default async function CoinsStatusServer() {
    const initialData = await getAllCoins24hStatus();
    return <CoinsStatusClient initialData={initialData} />;
}

// function CoinsStatusSkeleton() {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((i) => (
//                 <div
//                     key={i}
//                     className="bg-white rounded-lg shadow p-6 animate-pulse"
//                 >
//                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                     <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                 </div>
//             ))}
//         </div>
//     );
// }
