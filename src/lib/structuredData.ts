function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getPriceValidUntil(daysAhead = 365): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysAhead);
  return formatIsoDate(date);
}

export function buildFreeUsShippingDetails(currency = "USD") {
  return {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "US",
    },
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
      currency,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 3,
        maxValue: 6,
        unitCode: "DAY",
      },
    },
  };
}

export function buildNoReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  };
}
