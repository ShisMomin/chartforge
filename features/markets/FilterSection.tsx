'use client';
import FilterSelect from '@/shared/components/ui/FilterSelect';

type Props = {
    activeQuoteCurrencies: string[];
    quoteCurrency: string;
    handleQuoteCurrency: (item: string) => void;
    sortOrderType: string;
    handleSortOrderType: (value: string) => void;
    activeOrderValueLable: string;
    sortOrderValues: string[];
    handleSortOrderValues: (value: string) => void;
};
export default function FilterSection({
    activeQuoteCurrencies,
    quoteCurrency,
    handleQuoteCurrency,
    sortOrderType,
    handleSortOrderType,
    activeOrderValueLable,
    sortOrderValues,
    handleSortOrderValues,
}: Props) {
    // const orderValue = Object.keys(sortOrderValues);
    return (
        <div className="flex gap-5 sm:gap-10 justify-center">
            <div className="relative">
                <FilterSelect
                    itemList={activeQuoteCurrencies}
                    selectedItem={quoteCurrency}
                    onSelectionChangeHandler={handleQuoteCurrency}
                />
            </div>
            <div className="relative">
                <FilterSelect
                    itemList={['ASC', 'DESC']}
                    selectedItem={sortOrderType}
                    onSelectionChangeHandler={handleSortOrderType}
                />
            </div>
            <div className="relative">
                <FilterSelect
                    itemList={sortOrderValues}
                    selectedItem={activeOrderValueLable}
                    onSelectionChangeHandler={handleSortOrderValues}
                />
            </div>
        </div>
    );
}
