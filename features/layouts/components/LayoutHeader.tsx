import Divider from '@/shared/components/ui/Divider';
// import TimeFrameList from ' ui/TimeFrameList';
import TimeFrameList from '@/shared/components/ui/TimeFrameList';
import LayoutModal from '@/features/layouts/components/LayoutModal';
import GridChartIcon from '@/shared/components/ui/GridChartIcon';
import LayoutSelector from '@/features/layouts/components/LayoutSelector';
import ModeToggle from '@/shared/components/ui/ModeToggle';
import IndicatorButton from '@/shared/components/ui/IndicatorButton';
import IndicatorSelector from '@/features/layouts/components/IndicatorSelector';
import SyncButton from '@/shared/components/ui/SyncButton';
import SyncSelector from '@/features/layouts/components/SyncSelector';
import TimeframeButton from '../../../shared/components/ui/TimeFrameButton';
import { getAllLayout } from '@/lib/data-service';
import SearchSymbol from '../../../shared/components/ui/SearchSymbol';
import SearchButton from '@/shared/components/ui/SearchButton';
import NavDrawer from '@/shared/components/ui/NavDrawer';
import WatchlistButton from '@/shared/components/ui/WatchlistButton';
import Watchlist from '@/features/watchlist/components/Watchlist';
export default async function LayoutHeader() {
    const layouts = await getAllLayout();
    return (
        <header className="flex justify-between px-3 py-1 overflow-x-scroll overflow-y-clip max-w-screen bg-panel h-10 border-b border-active-border">
            <div className="flex gap-2 overflow-y-clip h-full">
                {/* <UserAvatar /> */}
                <NavDrawer />
                <Divider />
                <SearchSymbol>
                    <SearchButton />
                </SearchSymbol>
                <Divider />
                <LayoutModal
                    source={<TimeframeButton />}
                    possition={{ top: -10, left: 0 }}
                >
                    <TimeFrameList />
                </LayoutModal>
            </div>

            <div className="flex gap-2 overflow-y-clip h-full ml-2">
                <Divider classes="md2:hidden block" />
                <LayoutModal
                    source={<GridChartIcon rows={1} cols={1} size={25} />}
                    possition={{ top: -10, left: 0 }}
                >
                    <LayoutSelector layouts={layouts} />
                </LayoutModal>
                <Divider />
                <ModeToggle />
                <Divider />
                <LayoutModal
                    source={<IndicatorButton />}
                    possition={{ top: -10, left: 0 }}
                >
                    {/* <LayoutModal source={<SyncButton />}> */}
                    <IndicatorSelector />
                </LayoutModal>
                <Divider />
                <LayoutModal
                    source={<SyncButton />}
                    possition={{ top: -10, left: 0 }}
                >
                    <SyncSelector />
                </LayoutModal>
                <Divider />
                <LayoutModal
                    source={<WatchlistButton />}
                    modalWidth={300}
                    possition={{ top: -10, left: 0 }}
                >
                    <div className="h-130">
                        <Watchlist isEditable={false} />
                    </div>
                </LayoutModal>
            </div>
        </header>
    );
}
