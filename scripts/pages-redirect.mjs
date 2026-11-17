import { writeFile } from "node:fs/promises";

const destination = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/en/`;
await writeFile(new URL("../out/index.html", import.meta.url), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${destination}">
  <title>Anatomy Atelier</title>
  <link rel="canonical" href="${destination}">
</head>
<body><a href="${destination}">Open Anatomy Atelier</a></body>
</html>
`);
