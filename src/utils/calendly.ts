/**
 * Calendly URL Routing Logic
 *
 * Based on astra-lp.php routing logic
 * Routes to different Calendly calendars based on:
 * - Phone country code (GCR region)
 * - Customer status from HubSpot
 */

// Calendly URLs for different routing scenarios
const CALENDLY_URLS = {
  gcr: "https://calendly.com/astra-gcr/astra-product-demo-gcr",
  customer: "https://calendly.com/astra-demo/astra-srivathsan",
  default: "https://calendly.com/astra-demo/astra-product-demo-eng",
};

// API base URL for HubSpot contact lookup
const PROD_URL = "https://www.wati.io";
const PROD_BASE_URL =
  "https://prod-zoom-calendly-automation-2sxaovleia-as.a.run.app";
const DEV_BASE_URL =
  "https://prod-zoom-calendly-automation-2sxaovleia-as.a.run.app";

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin === PROD_URL ? PROD_BASE_URL : DEV_BASE_URL;
  }
  return DEV_BASE_URL;
}

// GCR country codes (Singapore +65, Malaysia +60, China +86, Hong Kong +852, Macau +853, Taiwan +886)
const GCR_COUNTRY_CODES = ["+65", "+60", "+86", "+852", "+853", "+886"];

/**
 * Check if phone number is from GCR region
 */
function isGCR(phone: string): boolean {
  if (!phone) return false;
  return GCR_COUNTRY_CODES.some((code) => phone.startsWith(code));
}

/**
 * Fetch contact from HubSpot by email
 */
async function fetchContactWithEmail(email: string): Promise<any> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/hubSpot/getContactByEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error("Error fetching contact details:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("HubSpot contact data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching contact:", error);
    return null;
  }
}

/**
 * Check if user is an existing customer
 */
async function isCustomer(email: string): Promise<boolean> {
  if (!email) return false;

  const contactData = await fetchContactWithEmail(email);

  if (contactData && contactData.results && contactData.results.length > 0) {
    const lifecycleStage = contactData.results[0].properties?.lifecyclestage;
    console.log("Lifecycle stage:", lifecycleStage);
    return lifecycleStage === "customer";
  }

  return false;
}

/**
 * Get appropriate Calendly URL based on routing logic
 *
 * Routing layers:
 * 1. Check if GCR region (by phone country code)
 * 2. Check if existing customer (by email in HubSpot)
 * 3. Default to standard demo calendar
 *
 * @param phone - User's phone number
 * @param email - User's email address
 * @returns Calendly URL
 */
export async function getCalendlyUrl(
  phone: string,
  email: string,
): Promise<string> {
  // Layer 1: Check if GCR
  if (isGCR(phone)) {
    console.log("Routing to GCR Calendly");
    return CALENDLY_URLS.gcr;
  }

  // Layer 2: Check if customer
  try {
    const isCustomerResult = await isCustomer(email);
    if (isCustomerResult) {
      console.log("Routing to Customer Calendly");
      return CALENDLY_URLS.customer;
    }
  } catch (error) {
    console.error("Error checking customer status:", error);
  }

  // Layer 3: Default
  console.log("Routing to Default Calendly");
  return CALENDLY_URLS.default;
}

/**
 * Build complete Calendly URL with parameters
 *
 * @param baseUrl - Base Calendly URL
 * @param data - Form data (firstname, email, phone)
 * @param utmParams - UTM parameters from URL
 * @returns Complete Calendly URL with all parameters
 */
export function buildCalendlyUrl(
  baseUrl: string,
  data: { firstname?: string; email?: string; phone?: string },
  utmParams: URLSearchParams,
): string {
  const params = new URLSearchParams();

  // Add user data
  if (data.firstname) {
    params.set("name", data.firstname);
  }
  if (data.email) {
    params.set("email", data.email);
  }
  if (data.phone) {
    // Remove parentheses and hyphens from phone number
    const cleanPhone = data.phone.replace(/[\(\)\-\s]/g, "");
    params.set("a2", cleanPhone);
  }

  // Get or set UTM parameters
  const utmKeys = [
    "utm_campaign",
    "utm_medium",
    "utm_source",
    "utm_content",
    "utm_term",
  ];

  utmKeys.forEach((key) => {
    const value = utmParams.get(key);
    if (value) {
      params.set(key, value);
    }
  });

  // Add default utm_content if not present
  if (!params.has("utm_content")) {
    params.set("utm_content", "astra_demo_flow_1225");
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get current URL parameters
 *
 * @returns URLSearchParams object with current query parameters
 */
export function getCurrentUrlParams(): URLSearchParams {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}
