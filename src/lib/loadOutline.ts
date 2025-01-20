import { XMLParser } from "fast-xml-parser";
import { errorMessage } from "./errorMessage";
import { OpmlData, OpmlOutline, TreeItem } from "./types";
import { purifyUrl } from "./purifyUrl";

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
                "User-Agent": `opml.xml.style/1.0 (your outline is being viewed on https://opml.xml.style/ )`,
                Referer: `https://opml.xml.style/`,
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
        `Content length: ${xml_resp.headers.get("Content-Length")}`
    );
    const contentType = xml_resp.headers.get("Content-Type");
    retVal.messages.push(`Content type: ${contentType || "(null)"}`);
    if (!contentType) {
        retVal.errorCount++;
        retVal.messages.push("No content type provided.");
        return retVal;
    }

    if (!contentType.startsWith("text/xml") && !contentType.startsWith("application/xml")) {
        retVal.errorCount++;
        retVal.messages.push("Invalid content type: " + contentType);
        return retVal;
    }

    const xml_str = await xml_resp.text();
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

    retVal.messages.push(`Entries: ${retVal.count}`);
    retVal.messages.push(`Parsing complete in ${Date.now() - start}ms.`);

    retVal.title = xml_data.opml?.head?.title;

    processNode(retVal, retVal.root, xml_data.opml.body.outline as OpmlOutline[]);

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
