'use client'
import * as React from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';

type SitemapTreeViewProps = {
    items: TreeViewBaseItem[]
}

function onClick(e: React.MouseEvent, itemId: string) {
    console.log(`clicked on ${JSON.stringify(itemId)}`);
}

interface CustomLabelProps {
    children: string;
    className: string;
    numberOfChildren: number;
    htmlUrl?: string;
    xmlUrl?: string;
}

function CustomLabel({ children, htmlUrl, className, xmlUrl }: CustomLabelProps) {
    const t = useTranslations('ViewPage');
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={4}
            flexGrow={1}
            className={className}
        >
            {htmlUrl ? <Typography component={NextLink} href={htmlUrl}>{children}</Typography>
                : <Typography>{children}</Typography>}

            {xmlUrl ? <a style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
                href={xmlUrl}><img alt={t("feed_icon_alt")} style={{ height: "1.25em" }} src="/images/feed.svg" /></a> : <></>}
        </Stack>
    );
}


const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: TreeItem2Props,
    ref: React.Ref<HTMLLIElement>,
) {
    const { publicAPI } = useTreeItem2(props);

    const childrenNumber = publicAPI.getItemOrderedChildrenIds(props.itemId).length;
    const item = publicAPI.getItem(props.itemId);
    const htmlUrl = item.htmlUrl ? item.htmlUrl : '';
    const xmlUrl = item.xmlUrl ? item.xmlUrl : '';
    //console.log(`item: ${JSON.stringify(item)}`);

    return (
        <TreeItem2
            {...props}
            ref={ref}
            slots={{
                label: CustomLabel,
            }}
            slotProps={{
                label: { numberOfChildren: childrenNumber, htmlUrl, xmlUrl } as CustomLabelProps,
            }}
        />
    );
});

export default function BasicRichTreeView({ items }: SitemapTreeViewProps) {
    return (
        <RichTreeView
            expansionTrigger="iconContainer"
            slots={{ item: CustomTreeItem }}
            items={items} onItemClick={onClick} />
    );
}