// import { createContext, ReactNode, useContext } from 'react';
// type ContextProps = {
//     columns: number;
// };
// const TableContext = createContext<ContextProps>({ columns: 0 });

// type TableProps = {
//     columns: number;
//     children: ReactNode;
// };
// function Table({ columns, children }: TableProps) {
//     <TableContext.Provider value={{ columns }}>
//         <div className="border border-gray-200 bg-transparent rounded-2xl overflow-hidden">
//             {children}
//         </div>
//     </TableContext.Provider>;
// }

// function Header() {
//     const { columns } = useContext(TableContext);
//     return (
//         <div className="py-5 px-9 bg-gray-50 border-b border-gray-100  text-gray-600"></div>
//     );
// }

'use client';
import React, {
    createContext,
    useContext,
    ReactNode,
    CSSProperties,
} from 'react';

interface TableContextType {
    columns: CSSProperties['gridTemplateColumns'];
    scroll: boolean;
    label: string;
}

const TableContext = createContext<TableContextType | null>(null);

interface TableProps {
    columns: CSSProperties['gridTemplateColumns'];
    label?: string;
    children: ReactNode;
    scroll?: boolean;
}

interface TableSectionProps {
    children: ReactNode;
}

function Table({ columns, scroll = false, label = '', children }: TableProps) {
    return (
        <TableContext.Provider value={{ columns, scroll, label }}>
            <div
                className={`${scroll ? 'overflow-hidden overflow-x-scroll overflow-y-scroll h-full' : ''}`}
            >
                <div
                    className={
                        `border border-panel-border text-sm bg-transparent rounded-lg 
                       `
                        //    ${scroll ? ' min-w-200' : ''}
                    }
                >
                    {children}
                </div>
            </div>
        </TableContext.Provider>
    );
}

function Header({ children }: TableSectionProps) {
    const context = useContext(TableContext);
    if (!context) throw new Error('Header must be used inside Table');

    return (
        <div
            className={`${context.scroll ? 'sticky top-0 bg-background' : ''}`}
        >
            <span className="p-4 text-xl font-bold sticky">
                {context.label}
            </span>
            {/* {context.label} */}
            {/* <div
                style={{ gridTemplateColumns: context.columns }}
                className={`grid items-center gap-x-4 px-3 py-4 border-b border-panel-border uppercase tracking-wide font-semibold text-gray-400 text-xs sm:text-sm ${context.scroll ? 'sticky top-0 bg-background' : ''}`}
            > */}
            <div
                style={{ gridTemplateColumns: context.columns }}
                className={`grid items-center gap-x-4 px-3 py-4 border-b border-panel-border uppercase tracking-wide font-semibold text-gray-400 text-xs sm:text-sm ${context.scroll ? 'sticky top-0 bg-background' : ''}`}
            >
                {children}
            </div>
        </div>
    );
}

function Row({ children }: TableSectionProps) {
    const context = useContext(TableContext);
    if (!context) throw new Error('Row must be used inside Table');

    return (
        <div
            style={{ gridTemplateColumns: context.columns }}
            className=" grid items-center gap-x-4 px-3 py-3 border-b border-panel-border last:border-b-0 text-xs sm:text-sm hover:bg-hover cursor-pointer"
        >
            {children}
        </div>
    );
}

interface BodyProps<T> {
    data: T[];
    render: (item: T, index: number) => ReactNode;
}

function Body<T>({ data, render }: BodyProps<T>) {
    if (!data.length)
        return (
            <p className="text-base font-medium text-center m-6">
                No data to show at the moment
            </p>
        );

    return <div className="my-1">{data.map(render)}</div>;
}

function Footer({ children }: TableSectionProps) {
    if (!children) return null;

    return <div className="bg-gray-50 flex justify-center p-3">{children}</div>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
