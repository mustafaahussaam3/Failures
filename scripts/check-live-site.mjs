const build = process.env.EXPECT_BUILD || "comm-edit-restore-2026-07-14-03";
const rawUrl = "https://raw.githubusercontent.com/mustafaahussaam3/Failures/main/index.html";
const liveUrl = `https://mustafaahussaam3.github.io/Failures/?v=${Date.now()}`;

async function read(url) {
  const response = await fetch(url, { cache: "no-store" });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    etag: response.headers.get("etag") || "",
    length: text.length,
    text,
  };
}

function assertContains(label, page, needle) {
  if (!page.text.includes(needle)) {
    throw new Error(`${label} is missing ${needle}`);
  }
}

const raw = await read(rawUrl);
const live = await read(liveUrl);

console.log(`RAW  status=${raw.status} length=${raw.length} etag=${raw.etag}`);
console.log(`LIVE status=${live.status} length=${live.length} etag=${live.etag}`);

assertContains("raw GitHub index.html", raw, build);
assertContains("raw GitHub index.html", raw, "SAVE ID / COMMENT");
assertContains("live GitHub Pages site", live, build);
assertContains("live GitHub Pages site", live, "SAVE ID / COMMENT");

console.log(`OK: live site is serving ${build}`);
