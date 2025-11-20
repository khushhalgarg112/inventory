import axios from "axios";
import { Platform } from "./config";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Generic API caller
export const callStockAPI = async (
  platform: Platform,
  pincode: string | null,
  code: string
) => {
  if (typeof platform.customRequest === "function") {
    try {
      return await platform.customRequest({ pincode, code, axios });
    } catch (err: any) {
      console.error(
        `Error in customRequest for ${platform.name}:`,
        err.message
      );
      return null;
    }
  }

  try {
    const headers: Record<string, string> = {};
    if (platform.apiKey) headers["x-api-key"] = platform.apiKey;

    if ((platform.method || "GET").toUpperCase() === "GET") {
      const res = await axios.get(platform.apiUrl, {
        params: { pincode, code },
        headers,
        timeout: 10_000,
      });
      return res.data;
    } else {
      const res = await axios.post(
        platform.apiUrl,
        { pincode, code },
        { headers, timeout: 10_000 }
      );
      return res.data;
    }
  } catch (err: any) {
    console.error(`HTTP error (${platform.name}) -`, err.message);
    return null;
  }
};

// Croma custom request
export const cromaCustomRequest = async ({
  pincode,
  code,
  axios,
  retryCount = 0,
}: {
  pincode: string;
  code: string;
  axios: any;
  retryCount?: number;
}) => {
  const pincodeStr = String(pincode);
  const maxRetries = 2;

  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    accesstoken: "2fe360a8-442f-4881-9b30-451c1643c339",
    client_id: "CROMA-WEB-APP",
    "content-type": "application/json",
    csc_code: "null",
    customerhash: "3256e9210dc30c675fefe93551b083e3",
    "oms-apim-subscription-key": "1131858141634e2abe2efb2b3a2a2a5d",
    origin: "https://www.croma.com",
    priority: "u=1, i",
    referer: "https://www.croma.com/",
    "sec-ch-ua": '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    source: "null",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  };

  const requestBody = {
    promise: {
      allocationRuleID: "SYSTEM",
      checkInventory: "Y",
      organizationCode: "CROMA",
      sourcingClassification: "EC",
      promiseLines: {
        promiseLine: [
          {
            fulfillmentType: "HDEL",
            itemID: String(code),
            lineId: "1",
            requiredQty: "1",
            shipToAddress: {
              zipCode: pincodeStr,
            },
            extn: {
              widerStoreFlag: "N",
            },
          },
        ],
      },
    },
  };

  try {
    console.log(
      `     🌐 [Croma API] Calling API for product ${code}, pincode ${pincode}`
    );
    const res = await axios.post(
      "https://api.croma.com/inventory/oms/v2/tms/details-pwa/",
      requestBody,
      {
        headers: headers,
        timeout: 10_000,
      }
    );
    console.log(
      `     ✅ [Croma API] Response received (Status: ${res.status})`
    );
    return res.data;
  } catch (err: any) {
    console.error(
      `     ❌ [Croma API] Error for product ${code}, pincode ${pincode}:`,
      err.message
    );

    if (
      err.response &&
      err.response.status === 403 &&
      retryCount < maxRetries
    ) {
      const delay = (retryCount + 1) * 2000;
      console.log(
        `     🔄 [Croma API] Rate limited (403) for product ${code}, retrying after ${delay}ms... (Attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      await sleep(delay);
      return cromaCustomRequest({
        pincode,
        code,
        axios,
        retryCount: retryCount + 1,
      });
    }

    return null;
  }
};

// Samsung custom request
export const samsungCustomRequest = async ({
  pincode,
  code,
  axios,
}: {
  pincode: string;
  code: string;
  axios: any;
}) => {
  try {
    const url = "https://www.samsung.com/in/api/v4/configurator/serviceability";
    const res = await axios.get(url, {
      params: {
        skus: code,
        postal_code: pincode,
      },
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        priority: "u=1, i",
        referer: "https://www.samsung.com/in/",
        "sec-ch-ua":
          '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      },
      timeout: 10_000,
    });
    return res.data;
  } catch (err: any) {
    console.error("Samsung API error:", err.message);
    return null;
  }
};

// Flipkart custom request
export const flipkartCustomRequest = async ({
  pincode,
  code,
  axios,
}: {
  pincode: string;
  code: string;
  axios: any;
}) => {
  try {
    const proxyUrl =
      process.env.FLIPKART_PROXY_URL ||
      "https://rknldeals.alwaysdata.net/flipkart_check";
    const res = await axios.post(
      proxyUrl,
      {
        productId: code,
        pincode: pincode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 25_000,
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("Flipkart API error:", err.message);
    return null;
  }
};

// Reliance Digital custom request
export const relianceDigitalCustomRequest = async ({
  pincode,
  code,
  axios,
}: {
  pincode: string;
  code: string;
  axios: any;
}) => {
  try {
    const url =
      "https://www.reliancedigital.in/ext/raven-api/inventory/multi/articles-v2";
    const payload = {
      articles: [
        {
          article_id: String(code),
          custom_json: {},
          quantity: 1,
        },
      ],
      phone_number: "0",
      pincode: String(pincode),
      request_page: "pdp",
    };

    const res = await axios.post(url, payload, {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        origin: "https://www.reliancedigital.in",
        referer: "https://www.reliancedigital.in/",
      },
      timeout: 20_000,
    });
    return res.data;
  } catch (err: any) {
    console.error("Reliance Digital API error:", err.message);
    return null;
  }
};

// iQOO custom request
export const iqooCustomRequest = async ({
  code,
  axios,
}: {
  code: string;
  axios: any;
}) => {
  try {
    const url = `https://mshop.iqoo.com/in/api/product/activityInfo/all/${code}`;
    const res = await axios.get(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: `https://mshop.iqoo.com/in/product/${code}`,
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/5.36",
      },
      timeout: 10_000,
    });
    return res.data;
  } catch (err: any) {
    console.error("iQOO API error:", err.message);
    return null;
  }
};

// Vivo custom request
export const vivoCustomRequest = async ({
  code,
  axios,
}: {
  code: string;
  axios: any;
}) => {
  try {
    const url = `https://mshop.vivo.com/in/api/product/activityInfo/all/${code}`;
    const res = await axios.get(url, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: `https://mshop.vivo.com/in/product/${code}`,
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/5.36",
      },
      timeout: 10_000,
    });
    return res.data;
  } catch (err: any) {
    console.error("Vivo API error:", err.message);
    return null;
  }
};

// Attach custom requests to platforms
export const attachCustomRequests = (platforms: Platform[]) => {
  platforms.forEach((platform) => {
    switch (platform.name) {
      case "Croma":
        platform.customRequest = cromaCustomRequest;
        break;
      case "Samsung":
        platform.customRequest = samsungCustomRequest;
        break;
      case "Flipkart":
        platform.customRequest = flipkartCustomRequest;
        break;
      case "Reliance Digital":
        platform.customRequest = relianceDigitalCustomRequest;
        break;
      case "iQOO":
        platform.customRequest = iqooCustomRequest;
        break;
      case "Vivo":
        platform.customRequest = vivoCustomRequest;
        break;
    }
  });
};
