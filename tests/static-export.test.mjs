import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);

test("exports each language with assets reachable below the Pages project path", async () => {
  for (const locale of ["en", "es", "hi", "zh", "ar", "pt", "fr", "de", "ja", "ru", "id", "ko"]) {
    const html = await readFile(new URL(`${locale}/index.html`, output), "utf8");
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.match(html, /src="\/anatomy\/anatomy\/heart\/thumb.webp"/);
    assert.match(html, new RegExp(`https://vianbas.github.io/anatomy/${locale}/`));
    for (const [, path] of html.matchAll(/(?:src|href)="(\/anatomy\/(?:_next\/[^"?]+|anatomy\/[^"?]+|favicon.svg|icon-\d+.png|apple-touch-icon.png))"/g)) {
      await access(new URL(path.slice("/anatomy/".length), output));
    }
  }
  for (const organ of ["heart", "brain", "lungs", "liver", "kidneys", "eyeball", "intestine", "pancreas", "skin"]) {
    await access(new URL(`models/${organ}.glb`, output));
  }
});

test("the project entry redirects to an exported language page", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  assert.match(html, /http-equiv="refresh" content="0;url=\/anatomy\/en\/"/);
  await access(new URL("en/index.html", output));
});
