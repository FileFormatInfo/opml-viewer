import { getTranslations } from 'next-intl/server';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { OpmlTreeView } from '@/components/OpmlTreeView';
import NavBar from '@/components/NavBar';
import { constants } from '@/lib/constants';
import { getFirst } from '@/lib/getFirst';
import { OpmlData, TreeItem } from '@/lib/types';
import { PoweredBy } from '@/components/PoweredBy';
import { trackUsage } from '@/lib/usage';
import { DEFAULT_SORT } from '@/components/SortSelect';
import { loadOutline } from '@/lib/loadOutline';
import { DEFAULT_TRANSFORM, getTransform } from '@/components/TransformSelect';
import { DEFAULT_LINKTRANSFORM, getLinkTransform } from '@/components/LinkSelect';

export default async function View({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const t = await getTranslations('ViewPage');

    const urlParams = (await searchParams);
    let showDebug = getFirst(urlParams['showdebug'], '0') === '1';
    const showMode = getFirst(urlParams['showmode'], '0') === '1';
    const showExit = getFirst(urlParams['showexit'], '0') === '1';
    const showLanguage = getFirst(urlParams['showlanguage'], '0') === '1';
    const customTitle = getFirst(urlParams['title'], t('title'));
    let url_str = getFirst(urlParams['url'], constants.DEMO_URL);
    if (!url_str || url_str === constants.DEFAULT_URL) {
        url_str = constants.DEMO_URL;
    }
    const sort = getFirst(urlParams['sort'], DEFAULT_SORT);

    let returnUrl = getFirst(urlParams['return'], '');
    if (returnUrl == '') {
        const defaultUrl = new URL(url_str);
        defaultUrl.pathname = '/';
        returnUrl = defaultUrl.toString();
    }

    trackUsage(url_str);

    const sme: OpmlData = await loadOutline(url_str);
    const items: TreeItem[] = sme.root.children;

    if (sort === 'name') {
        sortTree(items, (a, b) => a.label.localeCompare(b.label));
    } else if (sort === 'dirfirst') {
        sortTree(items, compareDirFirst);
    } else if (sort === 'url') {
        sortTree(items, compareUrl);
    }

    const transformer = getTransform(getFirst(urlParams['transform'], DEFAULT_TRANSFORM));
    if (transformer) {
        transform(items, transformer);
    }

    const linkTransformer = getLinkTransform(getFirst(urlParams['xml'], DEFAULT_LINKTRANSFORM));
    if (linkTransformer) {
        transform(items, linkTransformer);
    }

    const title = sme.title || customTitle;
    if (!sme.success) {
        showDebug = true;
    }

    return (
        <>
            <Container maxWidth={false} disableGutters={true} sx={{ minHeight: '100vh' }}>
                <NavBar debug={showDebug} exit={showExit} language={showLanguage} messages={sme.messages} mode={showMode} title={title} returnUrl={returnUrl} />
                <Container
                    maxWidth="md"
                    disableGutters={true}
                    sx={{ alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "top", minHeight: '100vh' }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        {sme.success || items.length ? <OpmlTreeView items={items} /> : <h1>Failed to load outline</h1>}
                    </Box>
                    <PoweredBy />
                </Container>
            </Container>
        </>

    );
}



function sortTree(items: TreeItem[], sortfn: (a: TreeItem, b: TreeItem) => number) {
    if (items.length == 0) {
        return;
    }
    if (items.length > 1) {
        items.sort(sortfn);
    }

    for (const item of items) {
        sortTree(item.children, sortfn);
    }
}

function compareDirFirst(a: TreeItem, b: TreeItem) {
    if (a.children.length > 0 && b.children.length == 0) {
        return -1;
    } else if (a.children.length == 0 && b.children.length > 0) {
        return 1;
    }
    return a.label.localeCompare(b.label)
}

function compareUrl(a: TreeItem, b: TreeItem) {
    const aUrl = a.htmlUrl || a.xmlUrl || a.label;
    const bUrl = b.htmlUrl || b.xmlUrl || b.label;
    return aUrl.localeCompare(bUrl);
}

function transform(items: TreeItem[], transformer: (item: TreeItem) => void) {
    for (const item of items) {
        transformer(item);
        if (item.children.length > 0) {
            transform(item.children, transformer);
        }
    }
}


