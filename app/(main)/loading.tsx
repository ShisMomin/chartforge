export default function MarketStatsSkeleton() {
    return (
        // <main className="h-[calc(100vh-64px)] overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-y-6 items-center h-full w-full">
            <div className="space-y-4 w-full md:w-[70%]">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-card w-full rounded-lg shadow p-6 animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-card border border-card rounded-lg p-3 text-sm text-foreground shadow animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                </div>
            </div>
            <div className="bg-card rounded-lg shadow p-6 animate-pulse min-h-100 w-[90%] md:w-[60%] md3:w-[50%]">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            </div>
            <div className="p-2 grid grid-cols-1 md3:grid-cols-2 gap-x-5 gap-y-5 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-card rounded-lg shadow p-6 animate-pulse h-200"
                    >
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        </div>
        // </main>
    );
}
