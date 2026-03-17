type GridChartIconProps = {
    rows: number;
    cols: number;
    size: number;
};
export default function GridChartIcon({
    rows = 1,
    cols = 1,
    size = 20,
}: GridChartIconProps) {
    const inner = 16;
    const stepX = inner / cols;
    const stepY = inner / rows;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-blue-400"
        >
            {/* Outer container */}
            <rect x="2" y="2" width="16" height="16" rx="3" />
            {/* Vertical dividers */}
            {Array.from({ length: cols - 1 }).map((_, i) => {
                const x = 2 + stepX * (i + 1);
                return <line key={`v-${i}`} x1={x} y1="3.5" x2={x} y2="16.5" />;
            })}
            {/* Horizontal dividers */}
            {Array.from({ length: rows - 1 }).map((_, i) => {
                const y = 2 + stepY * (i + 1);
                return <line key={`h-${i}`} x1="3.5" y1={y} x2="16.5" y2={y} />;
            })}
        </svg>
    );
}
