import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslations } from 'next-intl';
import { UseFormRegisterReturn } from 'react-hook-form';
import { TreeItem } from '@/lib/types';


type Transform = (typeof transforms)[number]

const transforms = ['original', 'initialcap', 'titlecase'] as const;

function initialCap(item: TreeItem): void {
    item.label = item.label.length == 0 ? item.label : item.label.charAt(0).toUpperCase() + item.label.slice(1);
}

function titleCaseWord(s: string): string {
    return s.length == 0 ? s : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function titleCase(item: TreeItem): void {
    item.label =  item.label.split(/\s+/).map(titleCaseWord).join(' ');
}

const DEFAULT_TRANSFORM:Transform = 'initialcap';

const transformMap = new Map<string, (item:TreeItem) => void>([
    ['initialcap', initialCap],
    ['titlecase', titleCase],
]);

function getTransform(value: string): ((item: TreeItem) => void) | null {
    return transformMap.get(value) || null;
}

type TransformSelectProps = {
    register: UseFormRegisterReturn<string>
}

function TransformSelect({ register }: TransformSelectProps) {
    const t = useTranslations('Transform');

    const sortedOptions = [...transforms].sort((a:Transform, b:Transform) => t(a).localeCompare(t(b)));

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink htmlFor="transform">
                {t('label')}
            </InputLabel>
            <Select
                native
                defaultValue={ DEFAULT_TRANSFORM}
                inputProps={{
                    name: 'transform',
                    id: 'transform',
                }}
                label={t('label')}
                {...register}
            >
                {sortedOptions.map((option) => (
                    <option key={option} value={option}>
                        {t(option)}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
}

export {
    DEFAULT_TRANSFORM,
    getTransform,
    TransformSelect,
}