export const PINCODES = ["122001"];

export interface Product {
  id: string;
  name: string;
  url?: string;
}

export interface Platform {
  name: string;
  apiUrl: string;
  method: string;
  apiKey: string | null;
  pincodes: string[];
  products: Product[];
  headers?: Record<string, string>;
  customRequest?: any;
}

export const PLATFORMS: Platform[] = [
  {
    name: "Croma",
    apiUrl: "https://api.croma.com/inventory/oms/v2/tms/details-pwa/",
    method: "POST",
    apiKey: null,
    pincodes: ["122001", "393001"],
    products: [
      {
        id: "317398",
        name: "Apple iPhone 17 256GB White",
        url: "https://www.croma.com/apple-iphone-17-256gb-white-/p/317398",
      },
      {
        id: "317400",
        name: "Apple iPhone 17 256GB Mist Blue",
        url: "https://www.croma.com/apple-iphone-17-256gb-mist-blue-/p/317400",
      },
      {
        id: "317396",
        name: "Apple iPhone 17 256GB Black",
        url: "https://www.croma.com/apple-iphone-17-256gb-black-/p/317396",
      },
      {
        id: "317403",
        name: "Apple iPhone 17 256GB Sage",
        url: "https://www.croma.com/apple-iphone-17-256gb-sage-/p/317403",
      },
      {
        id: "317401",
        name: "Apple iPhone 17 256GB Lavender",
        url: "https://www.croma.com/apple-iphone-17-256gb-lavender-/p/317401",
      },
      {
        id: "312574",
        name: "Vivo Y29 5G 4GB RAM 128GB Glacier Blue",
        url: "https://www.croma.com/vivo-y29-5g-4gb-ram-128gb-glacier-blue-/p/312574",
      },
      {
        id: "312575",
        name: "Vivo Y29 5G 4GB RAM 128GB Diamond Black",
        url: "https://www.croma.com/vivo-y29-5g-4gb-ram-128gb-diamond-black-/p/312575",
      },
      {
        id: "312577",
        url: "https://www.croma.com/vivo-y29-5g-4gb-ram-128gb-titanium-gold-/p/312577",
        name: "Vivo Y29 5G 4GB RAM 128GB Titanium Gold",
      },
      // {
      //   id: "316365",
      //   name: "vivo Y400 Pro 5G (8GB RAM, 256GB, Freestyle White )",
      //   url: "https://www.croma.com/vivo-y400-pro-5g-8gb-ram-256gb-freestyle-white-/p/316365",
      // },
      // {
      //   id: "316359",
      //   name: "vivo Y400 Pro 5G (8GB RAM, 256GB, Nebula Purple)",
      //   url: "https://www.croma.com/vivo-y400-pro-5g-8gb-ram-256gb-nebula-purple-/p/316359",
      // },
      // {
      //   id: "312574",
      //   name: "vivo Y29 5G (4GB RAM, 128GB, Glacier Blue)",
      //   url: "https://www.croma.com/vivo-y29-5g-4gb-ram-128gb-glacier-blue-/p/312574",
      // },
      // {
      //   id: "316358",
      //   name: "vivo Y400 Pro 5G (8GB RAM, 256GB, Fest Gold)",
      //   url: "https://www.croma.com/vivo-y400-pro-5g-8gb-ram-256gb-fest-gold-/p/316358",
      // },
    ],
    headers: {
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
    },
  },
  {
    name: "Samsung",
    apiUrl: "https://www.samsung.com/in/api/v4/configurator/serviceability",
    method: "GET",
    apiKey: null,
    pincodes: ["122001", "110016"],
    products: [],
  },
  {
    name: "Flipkart",
    apiUrl: "https://rknldeals.alwaysdata.net/flipkart_check",
    method: "POST",
    apiKey: null,
    pincodes: ["122001"],
    products: [],
  },
  // {
  //   name: "Reliance Digital",
  //   apiUrl:
  //     "https://www.reliancedigital.in/ext/raven-api/inventory/multi/articles-v2",
  //   method: "POST",
  //   apiKey: null,
  //   pincodes: ["122001", "485001"],
  //   products: [
  //     {
  //       id: "494741625",
  //       name: "Apple iPhone 17 256 GB, White",
  //       url: "https://www.reliancedigital.in/product/apple-iphone-17-256-gb-white-mff8s2-9391633?internal_source=search_collection",
  //     },
  //     {
  //       id: "494741626",
  //       name: "Apple iPhone 17 256 GB, Mist Blue",
  //       url: "https://www.reliancedigital.in/product/apple-iphone-17-256-gb-mist-blue-mff8s5-9391645?internal_source=search_collection",
  //     },
  //     {
  //       id: "494741624",
  //       name: "Apple iPhone 17 256 GB, Black",
  //       url: "https://www.reliancedigital.in/product/apple-iphone-17-256-gb-black-mff8ru-9391619?internal_source=search_collection",
  //     },
  //     {
  //       id: "494741627",
  //       name: "Apple iPhone 17 256 GB, Lavender",
  //       url: "https://www.reliancedigital.in/product/apple-iphone-17-256-gb-lavender-mff8ry-9391624?internal_source=search_collection",
  //     },
  //     {
  //       id: "494741628",
  //       name: "Apple iPhone 17 256 GB, Sage",
  //       url: "https://www.reliancedigital.in/product/apple-iphone-17-256-gb-sage-mff8s3-9391641?internal_source=search_collection",
  //     },
  //   ],
  // },
  // {
  //   name: "iQOO",
  //   apiUrl: "https://mshop.iqoo.com/in/api/product/activityInfo/all/",
  //   method: "GET",
  //   apiKey: null,
  //   pincodes: ["122001", "485001"],
  //   products: [
  //     {
  //       id: "2057",
  //       name: "Iqoo Neo 10R",
  //       url: "https://shop.iqoo.com/in/product/2057",
  //     },
  //     {
  //       id: "2063",
  //       name: "Iqoo Neo 10",
  //       url: "https://shop.iqoo.com/in/product/2063?skuId=8375",
  //     },
  //   ],
  // },
  {
    name: "Vivo",
    apiUrl: "https://mshop.vivo.com/in/api/product/activityInfo/all/",
    method: "GET",
    apiKey: null,
    pincodes: [],
    products: [],
  },
];
