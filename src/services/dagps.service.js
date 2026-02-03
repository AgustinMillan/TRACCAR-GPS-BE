const { chromium } = require("playwright");
const axios = require("axios");

class DAGPSClient {
  constructor(imei, pass) {
    this.imei = imei;
    this.pass = pass;
    this.userId = null;
    this.schoolId = null;
  }

  async init() {
    const browser = await chromium.launch({
      headless: true, // cambiar a false para debug visual
      // slowMo: 200
    });

    this.browser = browser;

    const context = await browser.newContext();
    const page = await context.newPage();
    this.page = page;

    // Listener para capturar datos del network
    page.on("request", (request) => {
      const url = request.url();

      // Captura userId desde loadUser
      if (
        url.includes("GetDataService.aspx") &&
        url.includes("method=loadUser")
      ) {
        const parsed = new URL(url);
        const userId = parsed.searchParams.get("user_id");

        if (userId) {
          this.userId = userId;
          console.log("✅ userId detectado:", userId);
        }
      }
    });

    // 1️⃣ Abrir login
    await page.goto("http://www.dagps.net/", { waitUntil: "domcontentloaded" });

    // 2️⃣ Tab IMEI
    await page.click("#tab_par li:nth-child(2)");

    // 3️⃣ Credenciales
    await page.fill('#loginformProduct input[name="userName"]', this.imei);
    await page.fill('#loginformProduct input[name="pwd_"]', this.pass);

    // 4️⃣ Login
    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.click("#loginA"),
    ]);

    // 5️⃣ Cookies
    const cookies = await context.cookies();
    this.cookies = cookies;

    // 6️⃣ MDS desde URL
    const finalUrl = page.url();
    const urlObj = new URL(finalUrl);
    const mds = urlObj.searchParams.get("mds");
    this.mds = mds;
    console.log("🔑 MDS:", mds || "NO PRESENTE");

    // Esperar a que aparezca userId en requests
    await this.waitForUserId();
  }

  async waitForUserId(timeout = 15000) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.userId) {
          clearInterval(interval);
          resolve(this.userId);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("❌ Timeout esperando userId"));
        }
      }, 3000);
    });
  }

  cookiesToHeader() {
    return this.cookies
      .filter((c) => c.domain.includes("dagps.net"))
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  }

  async getOnlineGpsInfo() {
    if (!this.userId) throw new Error("userId no disponible");
    if (!this.mds) throw new Error("mds no disponible");

    const cookieHeader = this.cookiesToHeader();

    const schoolId = this.schoolId || this.userId; // fallback habitual

    const url =
      "http://www.dagps.net/TrackService.aspx" +
      "?method=getOnlineGpsInfoByIDUtc" +
      `&userIDs=${this.userId}` +
      `&custid=${schoolId}` +
      `&school_id=${schoolId}` +
      "&mapType=GOOGLE" +
      "&option=en" +
      `&mds=${this.mds}` +
      `&t=${Date.now()}` +
      `&timestamp=${Date.now()}`;

    const res = await axios.get(url, {
      headers: {
        Cookie: cookieHeader,
        Referer: `http://www.dagps.net/user/indexp.aspx?mds=${this.mds}`,
        "User-Agent": "Mozilla/5.0",
      },
    });

    return {
      longitude: res.data.records[0][1],
      latitude: res.data.records[0][2],
    };
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = DAGPSClient;
