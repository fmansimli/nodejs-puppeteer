import puppeteer, { type Browser } from "puppeteer";

export const getDetail = async (browser: Browser, url: string, name: string) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(".section-no-color");

    const detail = await page.evaluate(() => {
      const detail: any = { title: "", a: [], b: [] };

      detail.title = document.querySelector("h3")?.textContent;

      const tables = document.querySelectorAll("table");

      tables.forEach((table, key) => {
        const trs = table.querySelector("tbody")?.querySelectorAll("tr");
        trs?.forEach(tr => {
          const question: any = { number: 0, text: "" };
          tr.querySelectorAll("td").forEach((td, index) => {
            if (index === 0) {
              question.number = Number(/[0-9]+/.exec(td.textContent!)![0]);
            } else {
              question.text = td.textContent;
            }
          });
          if (key === 0) {
            detail.a.push(question);
          } else {
            detail.b.push(question);
          }
        });
      });

      return detail;
    });

    await page.close();

    return Promise.resolve({ name, detail });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAll = async () => {
  try {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });

    const page = await browser.newPage();
    await page.goto("https://esldiscussions.com/");

    await page.waitForSelector(".section-no-color");

    const topics = await page.evaluate(() => {
      const results: any[] = [];
      const elements = document.querySelectorAll("tr");

      for (const element of elements) {
        const tds = element.querySelectorAll("td");

        for (const td of tds) {
          const link = td.querySelector("a");
          if (link) {
            results.push({
              name: link?.textContent,
              url: link?.href
            });
          }
        }
      }
      return results;
    });

    return topics;
  } catch (error) {
    console.error(error);
  }
};

export const getById = async (url: string, name: string) => {
  try {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });

    const detail = await getDetail(browser, String(url), name);
    return detail;
  } catch (error) {
    console.error(error);
  }
};
