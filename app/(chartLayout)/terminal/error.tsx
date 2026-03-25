'use client';
type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};
export default function Error({ error, reset }: ErrorProps) {
    return (
        <main className="flex justify-center items-center flex-col gap-6">
            <h1 className=" text-xl sm:text-3xl font-semibold">
                Something went wrong!
            </h1>
            {process.env.NODE_ENV === 'development' && (
                <p className="text-red-500">{error.message}</p>
            )}
            <button
                className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg cursor-pointer"
                onClick={reset}
            >
                Try again
            </button>
        </main>
    );
}
