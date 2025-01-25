import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslations } from 'next-intl';
import { UseFormRegisterReturn } from 'react-hook-form';
import { TreeItem } from '@/lib/types';


type LinkTransform = (typeof linktransforms)[number]

const linktransforms = ['raw', 'viewer', 'validator', 'analyzer'] as const;

function viewerTransform(item: TreeItem): void {
    if (item.xmlUrl) {
        item.xmlUrl = `https://www.rss.style/example.xml?feedurl=${encodeURIComponent(item.xmlUrl)}`
    }
    item.label = item.label.length == 0 ? item.label : item.label.charAt(0).toUpperCase() + item.label.slice(1);
}

function analyzerTransform(item: TreeItem): void {
    if (item.xmlUrl) {
        item.xmlUrl = `https://www.rss.style/feed-analyzer.html?feedurl=${encodeURIComponent(item.xmlUrl)}`
    }
    item.label = item.label.length == 0 ? item.label : item.label.charAt(0).toUpperCase() + item.label.slice(1);
}

function validatorTransform(item: TreeItem): void {
    if (item.xmlUrl) {
        item.xmlUrl = `https://validator.w3.org/feed/check.cgi?url=${encodeURIComponent(item.xmlUrl)}`
    }
    item.label = item.label.length == 0 ? item.label : item.label.charAt(0).toUpperCase() + item.label.slice(1);
}

const DEFAULT_LINKTRANSFORM: LinkTransform = 'viewer';

const linkTransformMap = new Map<LinkTransform, (item: TreeItem) => void>([
    ['analyzer', analyzerTransform],
    ['validator', validatorTransform],
    ['viewer', viewerTransform],
]);

function getLinkTransform(value: string): ((item: TreeItem) => void) | null {
    return linkTransformMap.get(value as LinkTransform) || null;
}

type LinkSelectProps = {
    register: UseFormRegisterReturn<string>
}

function LinkSelect({ register }: LinkSelectProps) {
    const t = useTranslations('LinkTransform');

    const sortedOptions = [...linktransforms].sort((a: LinkTransform, b: LinkTransform) => t(a).localeCompare(t(b)));

    return (
        <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel shrink htmlFor="transform">
                {t('label')}
            </InputLabel>
            <Select
                native
                defaultValue={DEFAULT_LINKTRANSFORM}
                inputProps={{
                    name: 'xml',
                    id: 'xml',
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
    DEFAULT_LINKTRANSFORM,
    getLinkTransform,
    LinkSelect,
}