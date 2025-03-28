import { XMLParser } from "fast-xml-parser";
import { errorMessage } from "./errorMessage";
import { OpmlData, OpmlOutline, TreeItem } from "./types";
import { purifyUrl } from "./purifyUrl";
import he from "he";

async function loadOutline(url_str: string):Promise<OpmlData> {

    const root:TreeItem = {
        id: "root",
        label: "root (not displayed)",
        children: [],
    };

    const retVal: OpmlData = {
        success: false,
        count: 0,
        errorCount: 0,
        messages: [],
        root,
        title: "",
    };

    if (!url_str) {
        retVal.errorCount++;
        retVal.messages.push("No ?url= parameter provided.");
        return retVal;
    }

    let url;
    try {
        url = new URL(url_str);
    } catch (err: unknown) {
        retVal.errorCount++;
        retVal.messages.push(errorMessage(err));
        return retVal;
    }
    retVal.messages.push(`Fetching outline: ${url_str}`);

    const start = Date.now();

    let xml_resp: globalThis.Response;

    try {
        xml_resp = await fetch(url, {
            headers: {
                "User-Agent": `opml-viewer/1.0 (your outline is being viewed on https://opml-viewer.fileformat.info/ )`,
                Referer: `https://opml-viewer.fileformat.info/`,
            },
        });
        if (!xml_resp.ok) {
            retVal.errorCount++;
            retVal.messages.push(
                "Failed to fetch outline: " + xml_resp.statusText
            );
            return retVal;
        }
    } catch (err: unknown) {
        retVal.errorCount++;
        retVal.messages.push(errorMessage(err));
        return retVal;
    }

    retVal.messages.push("Fetched url in " + (Date.now() - start) + "ms.");
    retVal.messages.push(
        `Content length (from header): ${xml_resp.headers.get("Content-Length")}`
    );
    let contentType = xml_resp.headers.get("Content-Type");
    retVal.messages.push(`Content type: ${contentType || "(null)"}`);
    if (!contentType) {
        retVal.messages.push("No content type provided.");
        contentType = "";
    }

    let isXml:boolean;
    if (
        contentType.startsWith("text/xml") ||
        contentType.startsWith("application/xml") ||
        contentType.startsWith("text/x-opml")
        ) {
            isXml = true;
    } else if (
        contentType.startsWith("text/plain") ||
        contentType.startsWith("application/octet-stream") ||
        contentType == ""
    ) {
        isXml = false;
        retVal.messages.push("Content type is not XML.");
    } else {
        retVal.errorCount++;
        retVal.messages.push("Invalid content type: " + contentType);
        return retVal;
    }

    let xml_str:string;
    try {
        xml_str = await xml_resp.text();
    } catch (err: unknown) {
        retVal.errorCount++;
        retVal.messages.push("Unable to get text: " + errorMessage(err));
        return retVal;
    }

    if (isXml == false) {
        if (xml_str.trim().startsWith("<")) {
            retVal.messages.push("Content starts with '<'. Attempting to parse as XML.");
        } else {
            retVal.errorCount++;
            retVal.messages.push(
                "Content does not start with '<'. Not parsing."
            );
            return retVal;
        }
    }

    retVal.messages.push(`JS string length: ${xml_str.length}`);

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let xml_data: any;
    const parserOptions = {
        attributeNamePrefix: "",
        ignoreAttributes: false,
    };
    const parser = new XMLParser(parserOptions);
    try {
        xml_data = parser.parse(xml_str);
    } catch (err: unknown) {
        retVal.errorCount++;
        retVal.messages.push(errorMessage(err));
        return retVal;
    }

    retVal.messages.push(`XML parsing complete in ${Date.now() - start}ms.`);

    let xmlTitle = xml_data.opml?.head?.title;
    if (xmlTitle && xmlTitle.indexOf("&") >= 0) {
        xmlTitle = he.decode(xmlTitle);
    }
    retVal.title = xmlTitle || "";

    const outlineStart = Date.now();
    processNode(retVal, retVal.root, xml_data.opml.body.outline as OpmlOutline[]);

    retVal.messages.push(`Entries: ${retVal.count}`);
    retVal.messages.push(`Outline parsing complete in ${Date.now() - outlineStart}ms.`);

    retVal.messages.push(`Total time: ${Date.now() - start}ms.`);

    retVal.success = retVal.errorCount === 0;

    return retVal;
}

function processNode(retVal: OpmlData, parent: TreeItem, data: OpmlOutline[]) {

    //console.log(data);

    for (const item of data) {
        retVal.count++;

        const newItem: TreeItem = {
            id: `ti-${retVal.count}`,
            label: item.title || item.text || "",
            htmlUrl: purifyUrl(item.htmlUrl) || purifyUrl(item.url),
            xmlUrl: purifyUrl(item.xmlUrl),
            children: [],
        };
        parent.children.push(newItem);

        if (item.outline) {
            const subtree: OpmlOutline[] = Array.isArray(item.outline) ? item.outline : [item.outline];
            processNode(retVal, newItem, subtree);
        }
    }
}


export {
    loadOutline,
}
