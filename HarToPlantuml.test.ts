import {
  entryToPlantuml,
  harStringToPlantuml,
  queryStringToPlantuml,
} from "./HarToPlantuml.ts";
import { assertEquals } from "@std/assert";
import { Entry } from "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/har-format/index.d.ts";

Deno.test("queryStringToPlantuml", () => {
  const params = [
    { name: "a", value: "1" },
    { name: "_cache", value: "rmrm" },
    { name: "b", value: "2" },
  ];
  const res = queryStringToPlantuml(params);
  const expected = "\n  &a=1\n  &b=2";
  assertEquals(res, expected);
});

Deno.test("entryToPlantuml", () => {
  const entry: Entry = {
    cache: {},
    request: {
      method: "POST",
      postData: { mimeType: "application/json", text: '{"data":"post body"}' },
      url: "http://localhost:8080/path/sub",
      httpVersion: "",
      cookies: [],
      headers: [],
      queryString: [{ name: "var_query", value: "var_query" }],
      headersSize: 0,
      bodySize: 0,
    },
    response: {
      status: 200,
      statusText: "OK",
      httpVersion: "",
      cookies: [],
      headers: [],
      content: { size: 0, mimeType: "application/json", text: '{"resp":"ex"}' },
      redirectURL: "",
      headersSize: 0,
      bodySize: 0,
    },
    startedDateTime: "",
    time: 0,
    timings: { wait: 0, receive: 0 },
  };
  const res = entryToPlantuml(entry);
  const expected = `App -> Serv : POST
note left
/path/sub
  &var_query=var_query
{
 "data": "post body"
}
end note
App <-- Serv: [200 OK]
note right
{
 "resp": "ex"
}
end note`;
  assertEquals(res, expected);
});

Deno.test("harStringToPlantuml", async () => {
  const harStr = await Deno.readTextFile("exemple/editor.swagger.io.har");
  const plantuml = harStringToPlantuml(harStr);
  const expected = await Deno.readTextFile(
    "exemple/editor.swagger.io.har.plantuml",
  );
  assertEquals(plantuml, expected);
});
