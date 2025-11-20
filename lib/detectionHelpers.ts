// Helper function to get Croma availability details
export const getCromaAvailabilityDetails = (code: string, resData: any) => {
  const availabilityDetails: any = {
    HDEL: null,
    STOR: null,
    SDEL: null,
  };

  try {
    const promise = resData.promise;
    if (
      !promise ||
      !promise.suggestedOption ||
      !promise.suggestedOption.option
    ) {
      return availabilityDetails;
    }

    const option = promise.suggestedOption.option;
    const promiseLines = option.promiseLines;

    if (promiseLines && Array.isArray(promiseLines.promiseLine)) {
      const fulfillmentTypes = ["HDEL", "STOR", "SDEL"];

      for (const fulfillmentType of fulfillmentTypes) {
        const line = promiseLines.promiseLine.find(
          (l: any) => l.fulfillmentType === fulfillmentType && l.itemID === code
        );

        if (
          line &&
          line.assignments &&
          Array.isArray(line.assignments.assignment)
        ) {
          const validAssignments = line.assignments.assignment.filter(
            (assignment: any) => parseInt(assignment.quantity) > 0
          );

          if (validAssignments.length > 0) {
            availabilityDetails[fulfillmentType] = {
              available: true,
              assignments: validAssignments,
            };
          }
        }
      }
    }
  } catch (err: any) {
    console.error("Error parsing Croma availability details:", err.message);
  }

  return availabilityDetails;
};

// Helper function to get Samsung availability details
export const getSamsungAvailabilityDetails = (code: string, resData: any) => {
  const availabilityDetails: any = {
    localDealers: [],
    stores: [],
    deliveryModes: [],
  };

  try {
    if (!Array.isArray(resData) || resData.length === 0) {
      return availabilityDetails;
    }

    const item = resData[0];
    if (!item || !item.external_attributes) {
      return availabilityDetails;
    }

    const extAttrs = item.external_attributes;

    if (Array.isArray(extAttrs.local_dealers)) {
      availabilityDetails.localDealers = extAttrs.local_dealers.filter(
        (dealer: any) => dealer.serviceable === true
      );
    }

    if (Array.isArray(extAttrs.stores)) {
      availabilityDetails.stores = extAttrs.stores.filter(
        (store: any) => store.serviceable === true
      );
    }

    if (Array.isArray(item.delivery_modes) && item.delivery_modes.length > 0) {
      availabilityDetails.deliveryModes = item.delivery_modes.filter(
        (mode: any) => mode.estimated_delivery_date
      );
    }
  } catch (err: any) {
    console.error("Error parsing Samsung availability details:", err.message);
  }

  return availabilityDetails;
};

// Helper function to get Flipkart availability details
export const getFlipkartAvailabilityDetails = (code: string, resData: any) => {
  try {
    const response = resData.RESPONSE?.[code];
    if (!response) {
      console.log(`[Flipkart] No RESPONSE found for product ${code}`);
      return null;
    }

    const listing = response.listingSummary || {};
    const isAvailable =
      listing.available === true || listing.serviceable === true;
    const price = listing.pricing?.finalPrice?.decimalValue || null;

    return {
      available: isAvailable,
      price: price,
    };
  } catch (err: any) {
    console.error("Error parsing Flipkart availability:", err.message);
    return null;
  }
};

// Helper function to get Reliance Digital availability details
export const getRelianceDigitalAvailabilityDetails = (
  code: string,
  resData: any
) => {
  try {
    const articles = resData.data?.articles || [];
    if (articles.length === 0) return null;

    const article = articles[0];
    const error = article.error || {};
    const errorType = error.type;

    return {
      available: !(
        errorType &&
        ["OutOfStockError", "FaultyArticleError"].includes(errorType)
      ),
      errorMessage: error.message || null,
    };
  } catch (err: any) {
    console.error("Error parsing Reliance Digital availability:", err.message);
    return null;
  }
};

// Helper function to get iQOO/Vivo availability details
export const getIqooVivoAvailabilityDetails = (resData: any) => {
  try {
    if (resData.success !== "1" || !resData.data) return null;

    const skuList = resData.data.activitySkuList || [];
    let isInStock = false;

    for (const sku of skuList) {
      const reservableId = sku.activityInfo?.reservableId;
      if (reservableId === -1) {
        isInStock = true;
        break;
      }
    }

    return { available: isInStock };
  } catch (err: any) {
    console.error("Error parsing iQOO/Vivo availability:", err.message);
    return null;
  }
};

// Main availability detection function
export const detectAvailability = (
  platformName: string,
  code: string,
  pincode: string | null,
  resData: any
): boolean => {
  if (!resData) return false;

  if (platformName === "Samsung") {
    const availabilityDetails = getSamsungAvailabilityDetails(code, resData);
    return (
      availabilityDetails.localDealers.length > 0 ||
      availabilityDetails.stores.length > 0 ||
      availabilityDetails.deliveryModes.length > 0
    );
  }

  if (platformName === "Croma") {
    const availabilityDetails = getCromaAvailabilityDetails(code, resData);
    return (
      availabilityDetails.HDEL?.available ||
      availabilityDetails.STOR?.available ||
      availabilityDetails.SDEL?.available
    );
  }

  if (platformName === "Flipkart") {
    const availabilityDetails = getFlipkartAvailabilityDetails(code, resData);
    return availabilityDetails?.available === true;
  }

  if (platformName === "Reliance Digital") {
    const availabilityDetails = getRelianceDigitalAvailabilityDetails(
      code,
      resData
    );
    return availabilityDetails?.available === true;
  }

  if (platformName === "iQOO" || platformName === "Vivo") {
    const availabilityDetails = getIqooVivoAvailabilityDetails(resData);
    return availabilityDetails?.available === true;
  }

  // Common patterns for other platforms
  if (typeof resData === "object") {
    if (resData.available === true) return true;
    if (resData.inStock === true) return true;
    if (typeof resData.qty === "number" && resData.qty > 0) return true;
    if (typeof resData.quantity === "number" && resData.quantity > 0)
      return true;
    if (
      resData.data &&
      (resData.data.available === true ||
        (typeof resData.data.qty === "number" && resData.data.qty > 0))
    )
      return true;
  }

  return false;
};

// Helper function to generate product links
export const getProductLink = (
  platformName: string,
  productId: string,
  productUrl?: string
): string => {
  if (productUrl) return productUrl;

  const linkMap: Record<string, string> = {
    Croma: `https://www.croma.com/product-details?pid=${productId}`,
    Samsung: `https://www.samsung.com/in/tablets/galaxy-tab-s10/buy/?modelCode=${productId}INS`,
    Flipkart: `https://www.flipkart.com/product/p?pid=${productId}`,
    "Reliance Digital": `https://www.reliancedigital.in/product-details?articleId=${productId}`,
    iQOO: `https://mshop.iqoo.com/in/product/${productId}`,
    Vivo: `https://mshop.vivo.com/in/product/${productId}`,
  };

  return linkMap[platformName] || `Product ID: ${productId}`;
};

