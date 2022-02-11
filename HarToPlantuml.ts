#!/usr/bin/env -S deno run --allow-read --allow-write
import {
  Entry,
  Har,
  QueryString,
} from "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/har-format/index.d.ts";

const excludeQueryNames = ["_cache", "cache", "_dc"];

function formatJson(j: string) {
  try {
    return JSON.stringify(JSON.parse(j), null, " ");
  } catch (_) {
    return j;
  }
}

export function queryStringToPlantuml(queryString: QueryString[]) {
  const query = queryString.filter((q) => !excludeQueryNames.includes(q.name));
  if (query.length) {
    return "\n" + query.map((q) => `  &${q.name}=${q.value}`).join("\n");
  }
}

export function entryToPlantuml(entry: Entry) {
  const { request, response } = entry;
  const { method, url, postData, queryString } = request;
  const { status, content, statusText } = response;
  const path = url.replace(/^https?:\/\/[^\/]*\/([^?]*).*$/, "/$1");

  const postDataPlantuml = postData?.text && [formatJson(postData.text)];
  const responsePlantuml = content.mimeType === "application/json" &&
    content.text && ["note right", formatJson(content.text), "end note"];

  return [
    `App -> Serv : ${method}`,
    "note left",
    `${path}${queryStringToPlantuml(queryString) || ""}`,
    ...(postDataPlantuml || []),
    "end note",
    `App <-- Serv: [${status}${statusText ? (" " + statusText) : ""}]`,
    ...(responsePlantuml || []),
  ].join("\n");
}

function isXhr(entry: Entry) {
  return (
    entry._resourceType === "xhr" ||
    entry.response.headers
      .find((h) => h.name.toLowerCase() === "content-type")
      ?.value.match(/application\/json/)
  );
}

export function harStringToPlantuml(harStr: string) {
  const har = JSON.parse(harStr) as Har;
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

async function harFileToPlantuml(
  harPath: string,
  plantumlFile = harPath + ".plantuml",
) {
  if (!harPath) {
    throw new Error("The file arg is missing");
  }
  const harStr = await Deno.readTextFile(harPath);
  const plantuml = harStringToPlantuml(harStr);
  console.log(plantuml);
  await Deno.writeTextFile(plantumlFile, plantuml);
}

if (import.meta.main) {
  await harFileToPlantuml(Deno.args[0], Deno.args[1]);
}
