interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}
export default function Spinner({ className = '', size = 'md' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2 sm:w-8 sm:h-8 border-2',
        md: 'w-12 h-12 border-4 sm:w-16 sm:h-16 border-4',
        lg: 'w-16 h-16 border-4 sm:w-24 sm:h-24 border-4',
    };
    return (
        <div className="flex h-full">
            <div
                className={`
                mx-auto my-auto
                rounded-full
                animate-spin
                ${sizeClasses[size]}
                border-panel-border border-t-blue-600
                ${className}
                `}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}

// flex justify-center items-center
