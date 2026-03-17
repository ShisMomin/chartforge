'use client';
import { AppConfig } from '@/app-config';
// import TimeframeButton from '@/shared/components/ui/TimeFrameButton';
import { TimeFrame } from '@/shared/types/common';
import { useStore } from '@/store/store';
import { useState } from 'react';
import { selectActiveChartTimeframe } from '@/store/selectors/chartDataSelectors';

// const timeframes = [
//     '1s',
//     '5s',
//     '10s',
//     '15s',
//     '30s',
//     '1m',
//     '2m',
//     '3m',
//     '5m',
//     '10m',
//     '15m',
//     '30m',
//     '1h',
//     '2h',
//     '4h',
//     '8h',
//     '12h',
//     '1d',
//     '2d',
//     '3d',
//     '1w',
//     '2w',
//     '1M',
// ];
type TimeFrameTypes = TimeFrame['type'];
type SectionType = Record<TimeFrameTypes, boolean>;
const timeframes = AppConfig.getSupportedTimeFrames;
const groupedTimeframes: Record<TimeFrameTypes, TimeFrame[]> = {
    Seconds: timeframes.filter((tf) => tf.type === 'Seconds'),
    Minutes: timeframes.filter((tf) => tf.type === 'Minutes'),
    Hours: timeframes.filter((tf) => tf.type === 'Hours'),
    Days: timeframes.filter((tf) => tf.type === 'Days'),
};
// Create a typed array of the groups
const timeFrameTypes = Object.keys(groupedTimeframes) as TimeFrameTypes[];
export default function TimeFrameList() {
    // State for section expansion in dropdown
    const { setActiveChartTimeframe } = useStore();
    const interval = useStore(selectActiveChartTimeframe);
    const [expandedSections, setExpandedSections] = useState<SectionType>({
        Seconds: false,
        Minutes: true,
        Hours: true,
        Days: false,
    });
    const toggleSection = (section: TimeFrameTypes) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    return (
        <div className="max-h-100 overflow-y-auto">
            {timeFrameTypes.map((group) => {
                const items = groupedTimeframes[group];
                if (items.length === 0) return null;
                return (
                    <div key={group}>
                        {/* Collapsible Section Header */}
                        <div
                            className="flex items-center justify-between px-4 py-1.5 cursor-pointer select-none hover:bg-hover"
                            onClick={() => toggleSection(group)}
                        >
                            <span>{group.toUpperCase()}</span>
                            <span
                                className={`flex items-center justify-center transition-transform duration-200 ease-in-out -rotate-90
                                ${expandedSections[group] ? 'rotate-0' : ''}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 8"
                                    width="16"
                                    height="8"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"
                                    ></path>
                                </svg>
                            </span>
                        </div>
                        {expandedSections[group] && (
                            <div>
                                {items.map((tf) => (
                                    <div
                                        key={tf.value}
                                        className={`flex items-center justify-between px-4 py-1.5 cursor-pointer ${interval === tf.value ? 'bg-active' : 'hover:bg-hover'}`}
                                        onClick={() =>
                                            setActiveChartTimeframe(tf.value)
                                        }
                                    >
                                        <span className="flex-1">
                                            {tf.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

//    {Object.entries(groupedTimeframes).map(
//                 ([group, items]) =>
//                     items.length > 0 && (
//                         <div
//                             key={group}
//                             onClick={() =>
//                                 toggleSection(group as TimeFrameType)
//                             }
//                         >
//                             {/* Collapsible Section Header */}
//                             <div className="flex items-center justify-between px-4 py-1.5 cursor-pointer select-none">
//                                 <span>{group.toUpperCase()}</span>
//                                 <span
//                                     className={`flex items-center justify-center transition-transform duration-200 ease-in-out -rotate-90
//  ${expandedSections[group as TimeFrameType] ? 'rotate-0' : ''}`}
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 16 8"
//                                         width="16"
//                                         height="8"
//                                     >
//                                         <path
//                                             fill="currentColor"
//                                             d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"
//                                         ></path>
//                                     </svg>
//                                 </span>
//                             </div>
//                         </div>
//                     ),
//             )}
// export default function TimeFrameList() {
//     const timeframes = AppConfig.getSupportedIntervals;
//     return (
//         <div className="sm:px-2 sm:py-1 min-w-sm max-w-1xl flex gap-3 flex-nowrap overflow-x-scroll">
//             {timeframes.map((timeframe) => (
//                 <TimeframeButton label={timeframe} key={timeframe} />
//             ))}
//         </div>
//     );
// }
