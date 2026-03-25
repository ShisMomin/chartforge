import ChartGrids from '@/features/layouts/components/ChartGrids';
import AllCharts from '@/features/layouts/charts/AllCharts';
export default function ChartLayout() {
    return (
        <main className="w-full h-full min-h-0 ">
            <ChartGrids>
                <AllCharts />
            </ChartGrids>
        </main>
    );
}
