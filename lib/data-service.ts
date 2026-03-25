import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ChartLayoutSchema, type ChartLayout } from '@/schemas';
import { ChartGrid } from '@/shared/types/common';
import { notFound } from 'next/navigation';

export async function getChartLayout(id: string): Promise<ChartLayout> {
    try {
        const { data, error } = await supabaseAdmin
            .from('chart_layouts')
            .select('*')
            .eq('id', Number(id))
            .single();
        if (error || !data) {
            console.error('Supabase error:', error);
            notFound();
        }
        return ChartLayoutSchema.parse({
            numRows: data.numRows,
            numCols: data.numCols,
            charts: data.charts,
        });
    } catch (error) {
        console.error('Failed to fetch or parse chart layout:', error);
        notFound();
    }
}

export async function getAllLayout(): Promise<ChartGrid[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('chart_layouts')
            .select('id,numRows, numCols')
            .order('id', { ascending: true });

        if (error || !data) {
            console.error('Supabase error:', error);
            notFound();
        }

        return data.filter(
            (row): row is ChartGrid =>
                row.numRows !== null && row.numCols !== null,
        );
    } catch (error) {
        console.error('Failed to fetch or parse chart layout:', error);
        notFound();
    }
}
