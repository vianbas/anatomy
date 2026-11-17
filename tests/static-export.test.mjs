import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);

test("exports each language with assets reachable on the custom domain", async () => {
  for (const locale of ["en", "es", "hi", "zh", "ar", "pt", "fr", "de", "ja", "ru", "id", "ko"]) {
    const html = await readFile(new URL(`${locale}/index.html`, output), "utf8");
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.match(html, /src="\/anatomy\/heart\/thumb.webp"/);
    assert.ok(html.includes(`rel="canonical" href="https://anatomy.vikoabastian.com/${locale}/"`));
    for (const [, path] of html.matchAll(/(?:src|href)="(\/(?:_next\/[^"?]+|anatomy\/[^"?]+|favicon.svg|icon-\d+.png|apple-touch-icon.png))"/g)) {
      await access(new URL(path.slice(1), output));
    }
  }
  for (const organ of ["heart", "brain", "lungs", "liver", "kidneys", "eyeball", "intestine", "pancreas", "skin"]) {
    await access(new URL(`models/${organ}.glb`, output));
  }
});

test("the project entry redirects to an exported language page", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  assert.match(html, /http-equiv="refresh" content="0;url=\/en\/"/);
  await access(new URL("en/index.html", output));
});
