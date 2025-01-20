
type OpmlData = {
    success: boolean;
    count: number;
    errorCount: number;
    messages: string[];
    title: string|undefined;
    root: TreeItem;
};

type OpmlOutline = {
    text: string;
    title: string;
    xmlUrl: string;
    htmlUrl: string;
    outline: OpmlOutline[] | OpmlOutline;
}

type TreeItem = {
    id: string;
    label: string;
    htmlUrl?: string;
    xmlUrl?: string;
    children: TreeItem[];
};

export type { OpmlData, OpmlOutline, TreeItem };