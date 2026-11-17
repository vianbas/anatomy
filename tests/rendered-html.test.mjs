import assert from "node:assert/strict";
import test from "node:test";
import worker from "../dist/server/index.js";

function render(path) {
  return worker.fetch(
    new Request(`https://example.com${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("redirects the root to the default language", async () => {
  const response = await render("/");
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "/en");
});

for (const { locale, direction, title, heading, viewer } of [
  { locale: "en", direction: "ltr", title: "Learn anatomy like an artist", heading: "Heart", viewer: "Heart interactive viewer" },
  { locale: "id", direction: "ltr", title: "Belajar anatomi seperti seorang seniman", heading: "Jantung", viewer: "Penampil interaktif: Jantung" },
  { locale: "ar", direction: "rtl", title: "تعلَّم التشريح كما يفعل الفنان", heading: "القلب", viewer: "العارض التفاعلي: القلب" },
]) {
  test(`server-renders the anatomy explorer in ${locale}`, async () => {
    const response = await render(`/${locale}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.ok(html.includes(`<html lang="${locale}" dir="${direction}">`));
    assert.ok(html.includes(`<title>Anatomy Atelier — ${title}</title>`));
    assert.ok(html.includes(`<h1>${heading}</h1>`));
    assert.ok(html.includes(`aria-label="${viewer}"`));
    assert.match(html, /<main\b/);
    assert.match(html, /src="\/anatomy\/heart\/thumb.webp"/);
  });
}

test("rejects an unknown language instead of serving the default content", async () => {
  const response = await render("/zz");
  assert.equal(response.status, 404);
  assert.doesNotMatch(await response.text(), /<h1>Heart<\/h1>/);
});
