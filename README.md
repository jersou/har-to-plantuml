# HarToPlantuml

This project convert XHR queries to Plantuml file.

This project is written in Typescript for [deno](https://deno.land/) runtime.
Install deno : https://deno.land/#installation

## Usage

```shell
deno run -A HarToPlantuml.ts file.har
```

or run from web directly (will be cached for the next launches) :

```shell
deno run -A https://raw.githubusercontent.com/jersou/har-to-plantuml/main/HarToPlantuml.ts file.har
```

## Install HarToPlantuml

```
deno install --name har2uml --allow-read --allow-write -f https://raw.githubusercontent.com/jersou/har-to-plantuml/master/HarToPlantuml.ts
→ and then run : har2uml file.har
```

## Development

The folder `.DENO_DIR` and `.lock.json` are **not** necessary for the project to
work, it just allows to save its dependencies.

Some dev command are listed in the scripts.yaml file, this file can be use with
[Velociraptor](https://velociraptor.run/docs/installation/) :

- start: run HarToPlantuml.ts
- test: launch tests
- test-watch: launch tests on file change
- lint: lint the code
- fmt: format the code
- bundle: bundle the project and its dependencies to dist/HarToPlantuml.js
- bak-dep: backup the dependencies to `.DENO_DIR` and update `.lock.json`
- gen-cov: generate the test coverage
