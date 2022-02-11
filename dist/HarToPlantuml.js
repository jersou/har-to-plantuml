// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const importMeta = {
    url: "file:///data/Projets/Logiciels/deno/HarToPlantuml/HarToPlantuml.ts",
    main: import.meta.main
};
const excludeQueryNames = [
    "_cache",
    "cache",
    "_dc"
];
function formatJson(j) {
    try {
        return JSON.stringify(JSON.parse(j), null, " ");
    } catch (_) {
        return j;
    }
}
function queryStringToPlantuml(queryString) {
    const query = queryString.filter((q)=>!excludeQueryNames.includes(q.name)
    );
    if (query.length) {
        return "\n" + query.map((q)=>`  &${q.name}=${q.value}`
        ).join("\n");
    }
}
function entryToPlantuml(entry) {
    const { request , response  } = entry;
    const { method , url , postData , queryString  } = request;
    const { status , content , statusText  } = response;
    const path = url.replace(/^https?:\/\/[^\/]*\/([^?]*).*$/, "/$1");
    const postDataPlantuml = postData?.text && [
        formatJson(postData.text)
    ];
    const responsePlantuml = content.mimeType === "application/json" && content.text && [
        "note right",
        formatJson(content.text),
        "end note"
    ];
    return [
        `App -> Serv : ${method}`,
        "note left",
        `${path}${queryStringToPlantuml(queryString) || ""}`,
        ...postDataPlantuml || [],
        "end note",
        `App <-- Serv: [${status}${statusText ? " " + statusText : ""}]`,
        ...responsePlantuml || [], 
    ].join("\n");
}
function isXhr(entry) {
    return entry._resourceType === "xhr" || entry.response.headers.find((h)=>h.name.toLowerCase() === "content-type"
    )?.value.match(/application\/json/);
}
function harStringToPlantuml(harStr) {
    const har = JSON.parse(harStr);
    const xhrEntries = har.log.entries.filter(isXhr);
    return [
        "@startuml",
        "skinparam sequenceMessageAlign direction",
        "actor App",
        "database Serv",
        ...xhrEntries.map(entryToPlantuml),
        "@enduml", 
    ].join("\n\n");
}
async function harFileToPlantuml(harPath, plantumlFile = harPath + ".plantuml") {
    if (!harPath) {
        throw new Error("The file arg is missing");
    }
    const harStr = await Deno.readTextFile(harPath);
    const plantuml = harStringToPlantuml(harStr);
    console.log(plantuml);
    await Deno.writeTextFile(plantumlFile, plantuml);
}
if (importMeta.main) {
    await harFileToPlantuml(Deno.args[0], Deno.args[1]);
}
export { queryStringToPlantuml as queryStringToPlantuml };
export { entryToPlantuml as entryToPlantuml };
export { harStringToPlantuml as harStringToPlantuml };
