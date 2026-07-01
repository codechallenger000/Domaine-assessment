const fs = require("fs");
const http = require("http");
const path = require("path");
const { createServer } = require("./preview-server");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "snippets/product-card.liquid",
  "snippets/demo-product-card.liquid",
  "sections/featured-product-card.liquid",
  "assets/product-card.js",
  "assets/theme.css",
  "src/styles/tailwind.css",
  "index.html",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `${file} is missing`);
}

async function request(pathname, port) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${pathname}`, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({ statusCode: response.statusCode, body });
        });
      })
      .on("error", reject);
  });
}

async function main() {
  const liquid = read("snippets/product-card.liquid");
  const demoLiquid = read("snippets/demo-product-card.liquid");
  const script = read("assets/product-card.js");
  const css = read("assets/theme.css");
  const preview = read("index.html");

  assert(liquid.includes("data-sale-badge"), "sale badge is not wired in Liquid");
  assert(demoLiquid.includes("green.png"), "demo card is not using supplied assets");
  assert(demoLiquid.includes("data-variant-compare-price"), "demo card swatch pricing is missing");
  assert(liquid.includes("compare_at_price"), "compare-at pricing is missing");
  assert(liquid.includes("data-swatch"), "variant swatches are missing");
  assert(liquid.includes("data-secondary-image"), "secondary image data is missing");
  assert(script.includes("aria-pressed"), "swatches do not update pressed state");
  assert(script.includes("data-compare-price-output"), "price update behavior is missing");
  assert(script.includes("variantComparePrice"), "swatch compare-price behavior is missing");
  assert(css.includes(".product-card:hover") && css.includes(".product-card__image--secondary"), "hover image style is missing");
  assert(preview.match(/data-swatch/g).length >= 6, "preview should include six swatches");
  assert(preview.includes("./assets/green.png"), "preview is not using the supplied primary assets");
  assert(preview.includes("./assets/green-secondary.png"), "preview is not using the supplied secondary assets");

  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const page = await request("/", port);
    const cssResponse = await request("/assets/theme.css", port);
    const jsResponse = await request("/assets/product-card.js", port);

    assert(page.statusCode === 200, "preview page did not load");
    assert(cssResponse.statusCode === 200, "compiled CSS did not load");
    assert(jsResponse.statusCode === 200, "card JavaScript did not load");
    assert(page.body.includes("Plain T-shirt"), "preview product title is missing");
    const swatchButtons = page.body.match(/<button[\s\S]*?data-swatch[\s\S]*?<\/button>/g) || [];
    assert(swatchButtons.length >= 6, "preview swatch buttons were not served correctly");
    assert(swatchButtons.every((button) => !button.includes("data-price=")), "swatch buttons still use visible price attributes");
    assert(swatchButtons.every((button) => !button.includes("data-compare-price=")), "swatch buttons still use visible compare-price attributes");
  } finally {
    server.close();
  }

  console.log("Project check passed");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
