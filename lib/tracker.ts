import axios from "axios";
import { PLATFORMS, PINCODES } from "./config";
import { callStockAPI, attachCustomRequests } from "./apiClient";
import {
  detectAvailability,
  getProductLink,
  getCromaAvailabilityDetails,
  getSamsungAvailabilityDetails,
  getFlipkartAvailabilityDetails,
  getRelianceDigitalAvailabilityDetails,
} from "./detectionHelpers";
import { sendTelegram } from "./telegramService";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Attach custom request handlers to platforms
attachCustomRequests(PLATFORMS);

// Check platforms without pincode (iQOO, Vivo)
const checkPlatformsWithoutPincode = async () => {
  const platformsWithoutPincode = ["iQOO", "Vivo"];

  for (const platform of PLATFORMS) {
    if (!platformsWithoutPincode.includes(platform.name)) continue;
    if (!platform.products || platform.products.length === 0) continue;

    console.log(`\n🔍 Checking ${platform.name} (no pincode required)...`);

    for (const product of platform.products) {
      const productId = product.id;
      const productName = product.name;
      const productUrl = product.url;

      console.log(`  📦 Checking: ${productName} (ID: ${productId})`);

      try {
        let data;

        if (typeof platform.customRequest === "function") {
          data = await platform.customRequest({ code: productId, axios });
        } else {
          data = await callStockAPI(platform, null, productId);
        }

        const available = detectAvailability(
          platform.name,
          productId,
          null,
          data
        );

        if (available) {
          const productLink = getProductLink(
            platform.name,
            productId,
            productUrl
          );
          const text = `✅ *Stock Alert*\nPlatform: ${platform.name}\nProduct: [${productName}](${productLink})\n`;

          console.log(
            `  ✅ STOCK ALERT! ${platform.name} - ${productName} (ID: ${productId})`
          );
          console.log(`     🔗 Link: ${productLink}`);
          await sendTelegram(text);
          await sleep(500);
        } else {
          console.log(`  ❌ Out of stock: ${productName} (ID: ${productId})`);
        }

        await sleep(1000);
      } catch (err: any) {
        console.error(
          `  ⚠️ Error checking ${platform.name} ${productName} (ID: ${productId}):`,
          err.message
        );
        await sleep(1000);
      }
    }
  }
};

// Main stock checking function
export const checkStock = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 STARTING STOCK SWEEP");
  console.log("⏰ Time:", new Date().toLocaleString());
  console.log("=".repeat(60));

  let totalChecked = 0;
  let totalAlerts = 0;
  let totalErrors = 0;

  // Check platforms without pincode
  await checkPlatformsWithoutPincode();

  // Check other platforms with pincode iteration
  for (const platform of PLATFORMS) {
    // Skip platforms handled separately
    if (["iQOO", "Vivo"].includes(platform.name)) continue;

    if (!platform.products || platform.products.length === 0) continue;

    const platformPincodes =
      platform.pincodes && platform.pincodes.length > 0
        ? platform.pincodes
        : PINCODES;

    if (!platformPincodes || platformPincodes.length === 0) {
      console.log(`⚠️ Skipping ${platform.name} - no pincodes configured`);
      continue;
    }

    console.log(
      `\n🔍 Checking ${platform.name} with ${platformPincodes.length} pincode(s)...`
    );

    for (const product of platform.products) {
      const productId = product.id;
      const productName = product.name;
      const productUrl = product.url;

      for (const pincode of platformPincodes) {
        totalChecked++;
        console.log(
          `  📦 Checking: ${productName} (ID: ${productId}) @ Pincode: ${pincode}`
        );

        try {
          const data = await callStockAPI(platform, pincode, productId);
          const available = detectAvailability(
            platform.name,
            productId,
            pincode,
            data
          );

          if (available) {
            totalAlerts++;
            const productLink = getProductLink(
              platform.name,
              productId,
              productUrl
            );
            let text = `✅ *Stock Alert*\nPlatform: ${platform.name}\nProduct: [${productName}](${productLink})\n📍 Pincode: ${pincode}`;

            console.log(
              `  ✅ 🎉 STOCK ALERT! ${platform.name} - ${productName}`
            );
            console.log(`     📍 Pincode: ${pincode}`);
            console.log(`     🔗 Link: ${productLink}`);

            // Add platform-specific details
            if (platform.name === "Samsung") {
              const availabilityDetails = getSamsungAvailabilityDetails(
                productId,
                data
              );
              const availableOptions = [];

              if (availabilityDetails.localDealers.length > 0) {
                const dealer = availabilityDetails.localDealers[0];
                console.log(
                  `     🏪 Local Dealer: ${dealer.store_name || "N/A"} (${
                    dealer.location || dealer.city || "N/A"
                  })`
                );
                availableOptions.push(
                  `\n\n🏪 *Local Dealer Available*\n` +
                    `Store: ${dealer.store_name || "N/A"}\n` +
                    `Location: ${dealer.location || dealer.city || "N/A"}\n` +
                    `Quantity: ${dealer.quantity || "N/A"}`
                );
              }

              if (availabilityDetails.stores.length > 0) {
                const store = availabilityDetails.stores[0];
                console.log(
                  `     🏬 Store: ${store.store_name || "N/A"} (${
                    store.location || store.city || "N/A"
                  })`
                );
                availableOptions.push(
                  `\n\n🏬 *Store Available*\n` +
                    `Store: ${store.store_name || "N/A"}\n` +
                    `Location: ${store.location || store.city || "N/A"}`
                );
              }

              if (availabilityDetails.deliveryModes.length > 0) {
                const mode = availabilityDetails.deliveryModes[0];
                console.log(
                  `     🚚 Delivery: ${mode.estimated_delivery_date || "N/A"}`
                );
                availableOptions.push(
                  `\n\n🚚 *Delivery Available*\n` +
                    `Estimated Delivery: ${
                      mode.estimated_delivery_date || "N/A"
                    }`
                );
              }

              if (availableOptions.length > 0) {
                text += availableOptions.join("\n");
              }
            } else if (platform.name === "Croma") {
              const availabilityDetails = getCromaAvailabilityDetails(
                productId,
                data
              );
              const availableTypes = [];

              if (availabilityDetails.HDEL?.available) {
                const assignment = availabilityDetails.HDEL.assignments[0];
                console.log(
                  `     📦 Home Delivery: ${
                    assignment.deliveryDate || "N/A"
                  } (Qty: ${assignment.quantity})`
                );
                availableTypes.push(
                  `\n\n📦 *Home Delivery (HDEL) - Available*\n` +
                    `Delivery Date: ${assignment.deliveryDate || "N/A"}\n` +
                    `Time: ${assignment.fromTime || "N/A"} - ${
                      assignment.toTime || "N/A"
                    }\n` +
                    `Quantity: ${assignment.quantity}`
                );
              }

              if (availabilityDetails.STOR?.available) {
                const assignment = availabilityDetails.STOR.assignments[0];
                console.log(
                  `     🏪 Store Pickup: Available (Qty: ${
                    assignment.quantity || "N/A"
                  })`
                );
                availableTypes.push(
                  `\n\n🏪 *Store Pickup (STOR) - Available*\n` +
                    `Quantity: ${assignment.quantity || "N/A"}`
                );
              }

              if (availabilityDetails.SDEL?.available) {
                const assignment = availabilityDetails.SDEL.assignments[0];
                console.log(
                  `     🚚 Store Delivery: ${
                    assignment.deliveryDate || "N/A"
                  } (Qty: ${assignment.quantity})`
                );
                availableTypes.push(
                  `\n\n🚚 *Store Delivery (SDEL) - Available*\n` +
                    `Delivery Date: ${assignment.deliveryDate || "N/A"}\n` +
                    `Quantity: ${assignment.quantity}`
                );
              }

              if (availableTypes.length > 0) {
                text += availableTypes.join("\n");
              }
            } else if (platform.name === "Flipkart") {
              const details = getFlipkartAvailabilityDetails(productId, data);
              if (details?.price) {
                console.log(`     💰 Price: ₹${details.price}`);
                text += `\n💰 Price: ₹${details.price}`;
              }
            } else if (platform.name === "Reliance Digital") {
              const details = getRelianceDigitalAvailabilityDetails(
                productId,
                data
              );
              if (details?.errorMessage) {
                console.log(`     ⚠️ Note: ${details.errorMessage}`);
                text += `\n⚠️ Note: ${details.errorMessage}`;
              }
            }

            await sendTelegram(text);
            await sleep(500);
          } else {
            console.log(
              `  ❌ Out of stock: ${productName} (ID: ${productId}) @ ${pincode}`
            );
          }
        } catch (err: any) {
          totalErrors++;
          console.error(
            `  ⚠️ Error checking ${platform.name} ${productName} (ID: ${productId}) @ ${pincode}:`,
            err.message
          );
        }
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ STOCK SWEEP COMPLETED");
  console.log("⏰ Time:", new Date().toLocaleString());
  console.log(`📊 Summary:`);
  console.log(`   - Total checks: ${totalChecked}`);
  console.log(`   - Alerts sent: ${totalAlerts}`);
  console.log(`   - Errors: ${totalErrors}`);
  console.log("=".repeat(60) + "\n");
};
