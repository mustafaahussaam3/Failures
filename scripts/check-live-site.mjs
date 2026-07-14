const build = process.env.EXPECT_BUILD || "comm-edit-restore-2026-07-14-03";
const cacheBust = Date.now();
const repoApiUrl = "https://api.github.com/repos/mustafaahussaam3/Failures/contents/index.html?ref=main";
const liveUrl = `https://mustafaahussaam3.github.io/Failures/?v=${cacheBust}`;

async function read(url) {
  const response = await fetchWithRetry(url, { cache: "no-store" });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    etag: response.headers.get("etag") || "",
    length: text.length,
    text,
  };
}
async function readGitHubIndex() {
  const response = await fetchWithRetry(repoApiUrl, {
    cache: "no-store",
    headers: { "User-Agent": "Failures-live-check", Accept: "application/vnd.github+json" },
  });
  const json = await response.json();
  const text = Buffer.from(json.content || "", "base64").toString("utf8");
  return {
    ok: response.ok,
    status: response.status,
    etag: response.headers.get("etag") || "",
    length: text.length,
    text,
  };
}
async function fetchWithRetry(url, options, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      console.log(`fetch retry ${attempt}/${attempts}: ${url}`);
      await new Promise(resolve => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

function assertContains(label, page, needle) {
  if (!page.text.includes(needle)) {
    throw new Error(`${label} is missing ${needle}`);
  }
}

const raw = await readGitHubIndex();
const live = await read(liveUrl);

console.log(`RAW  status=${raw.status} length=${raw.length} etag=${raw.etag}`);
console.log(`LIVE status=${live.status} length=${live.length} etag=${live.etag}`);

assertContains("raw GitHub index.html", raw, build);
assertContains("raw GitHub index.html", raw, "SAVE ID / COMMENT");
assertContains("live GitHub Pages site", live, build);
assertContains("live GitHub Pages site", live, "SAVE ID / COMMENT");

console.log(`OK: live site is serving ${build}`);
