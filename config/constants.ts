export const ROLE = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SELLER: "seller"
};

export const DISCOUNT_OPTIONS = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed Amount", value: "flat" }
];

export const CouponType = {
  discount_on_purchase: "Discount on Purchase",
  free_delivery: "Free Delivery",
  first_order: "First Order",
  product_based: "Product Based"
};

export const PERMISSIONS = {
  // ── Top-level ──────────────────────────────────────────────────────────────
  ALL: "all",
  DASHBOARD: "dashboard",

  // ── Product Management ─────────────────────────────────────────────────────
  PRODUCT_MANAGEMENT: "product_management", // full module access
  PRODUCT_CATEGORIES: "product_categories",
  PRODUCT: "product",
  PRODUCT_BRAND: "product_brand",
  PRODUCT_ATTRIBUTES: "product_attributes",
  PRODUCT_BENEFIT_SETUP: "product_benefit_setup",
  INHOUSE_PRODUCTS: "inhouse_products",
  VENDOR_PRODUCTS: "vendor_products",
  COMBO_OFFER: "combo_offer",
  COMBO_BANNER: "combo_banner",
  DAMAGE_PRODUCT: "damage_product",
  REQUEST_RESTOCK: "request_restock",
  PRODUCT_UPDATE_REQUEST: "product_update_request",

  // ── User Management ────────────────────────────────────────────────────────
  USER_MANAGEMENT: "user_management", // full module access
  USER_VENDOR: "user_vendor",
  MONEY_WITHDRAW: "money_withdraw",
  USER_CUSTOMER: "user_customer",
  USER_MANAGER: "user_manager",

  // ── Order Management ───────────────────────────────────────────────────────
  ORDER_MANAGEMENT: "order_management", // full module access
  ORDER: "order",
  REFUND_REQUEST: "refund_request",

  // ── Other modules ──────────────────────────────────────────────────────────
  PRODUCT_REVIEW: "product_review",
  OFFERS_AND_DEALS: "offers_and_deals",
  BANNER_SETUP: "banner_setup",
  USER_ROLE_SETUP: "user_role_setup",
  ANNOUNCEMENT_SETUP: "announcement_setup",
  HELP_AND_SUPPORT: "help_and_support",
  BUSINESS_SETTINGS: "business_settings",
  INHOUSE_SHOP: "inhouse_shop",
  SETTINGS: "settings"
} as const;

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

//!its for showing permission in admin dashboard
export const PERMISSION_GROUPS = [
  {
    group: "General",
    single: true, // renders as single checkbox (no sub-items)
    items: [{ key: "DASHBOARD", label: "Dashboard", value: PERMISSIONS.DASHBOARD }]
  },
  {
    group: "Product Management",
    parent: { key: "PRODUCT_MANAGEMENT", label: "Product Management (All)", value: PERMISSIONS.PRODUCT_MANAGEMENT },
    items: [
      { key: "PRODUCT_CATEGORIES", label: "Categories", value: PERMISSIONS.PRODUCT_CATEGORIES },
      { key: "PRODUCT_BRAND", label: "Brand", value: PERMISSIONS.PRODUCT_BRAND },
      { key: "PRODUCT_ATTRIBUTES", label: "Attributes", value: PERMISSIONS.PRODUCT_ATTRIBUTES },
      { key: "PRODUCT_BENEFIT_SETUP", label: "Benefit Setup", value: PERMISSIONS.PRODUCT_BENEFIT_SETUP },
      { key: "INHOUSE_PRODUCTS", label: "In-house Products", value: PERMISSIONS.INHOUSE_PRODUCTS },
      { key: "VENDOR_PRODUCTS", label: "Vendor Products", value: PERMISSIONS.VENDOR_PRODUCTS },
      { key: "COMBO_OFFER", label: "Combo Offer", value: PERMISSIONS.COMBO_OFFER },
      { key: "COMBO_BANNER", label: "Combo Banner", value: PERMISSIONS.COMBO_BANNER },
      { key: "DAMAGE_PRODUCT", label: "Damage Product", value: PERMISSIONS.DAMAGE_PRODUCT },
      { key: "REQUEST_RESTOCK", label: "Request Re-stoke", value: PERMISSIONS.REQUEST_RESTOCK },
      { key: "PRODUCT_UPDATE_REQUEST", label: "Update Request", value: PERMISSIONS.PRODUCT_UPDATE_REQUEST }
    ]
  },
  {
    group: "User Management",
    parent: { key: "USER_MANAGEMENT", label: "User Management (All)", value: PERMISSIONS.USER_MANAGEMENT },
    items: [
      { key: "USER_VENDOR", label: "Vendor", value: PERMISSIONS.USER_VENDOR },
      { key: "MONEY_WITHDRAW", label: "Money Withdraw", value: PERMISSIONS.MONEY_WITHDRAW },
      { key: "USER_CUSTOMER", label: "Customer", value: PERMISSIONS.USER_CUSTOMER },
      { key: "USER_MANAGER", label: "Manager", value: PERMISSIONS.USER_MANAGER }
    ]
  },
  {
    group: "Order Management",
    parent: { key: "ORDER_MANAGEMENT", label: "Order Management (All)", value: PERMISSIONS.ORDER_MANAGEMENT },
    items: [
      { key: "ORDER", label: "Order", value: PERMISSIONS.ORDER },
      { key: "REFUND_REQUEST", label: "Refund Request", value: PERMISSIONS.REFUND_REQUEST }
    ]
  },
  {
    group: "Other Modules",
    single: true,
    items: [
      { key: "PRODUCT_REVIEW", label: "Product Review", value: PERMISSIONS.PRODUCT_REVIEW },
      { key: "OFFERS_AND_DEALS", label: "Offers & Deals", value: PERMISSIONS.OFFERS_AND_DEALS },
      { key: "BANNER_SETUP", label: "Banner Setup", value: PERMISSIONS.BANNER_SETUP },
      { key: "USER_ROLE_SETUP", label: "User Role Setup", value: PERMISSIONS.USER_ROLE_SETUP },
      { key: "ANNOUNCEMENT_SETUP", label: "Announcement Setup", value: PERMISSIONS.ANNOUNCEMENT_SETUP },
      { key: "HELP_AND_SUPPORT", label: "Help & Support", value: PERMISSIONS.HELP_AND_SUPPORT },
      { key: "BUSINESS_SETTINGS", label: "Business Settings", value: PERMISSIONS.BUSINESS_SETTINGS },
      { key: "INHOUSE_SHOP", label: "Inhouse Shop", value: PERMISSIONS.INHOUSE_SHOP },
      { key: "SETTINGS", label: "Settings", value: PERMISSIONS.SETTINGS }
    ]
  }
] as const;

// ── All non-ALL values ─────────────────────────────────────────────────────────

export const ALL_PERMISSION_VALUES = Object.entries(PERMISSIONS)
  .filter(([key]) => key !== "ALL")
  .map(([, value]) => value) as PermissionValue[];

export const defaultLocale = "en";

export const COOKIE_NAME = "NEXT_LOCALE";

export const allRoutes = {
  comboOffer: "/combo-offers",
  trackOrder: "/track-order",
  brands: "/brands",
  home: "/",
  contact: "/contact-us",
  becomeASeller: "/become-a-seller",
  termsConditions: "/terms-conditions",
  privacyPolicy: "/privacy-policy",
  refundPolicy: "/refund-policy",
  sellerPolicy: "/seller-policy",
  shippingDelivery: "/shipping-delivery",
  returnRefund: "/return-refund",
  sellerLogin: "/seller-login",
  wishlist: "/wishlist",
  orders: "/orders",
  products: "/product-list",
  flashSales: "/product-list/offers",
  bestDeals: "/product-list/best-deals",
  comboOffers: "/combo-offers",
  bestSellers: "/product-list",
  sellerProfile: "/seller-profile",
  categories: "/categories",
  login: "/login",
  howToSell: "/how-to-sell",
  support: "/support",
  cart: "/cart",
  checkout: "/checkout",
  orderNow: "/order-now"
};

export const cacheTags = {
  adminProfile: "admin-profile",
  cart: "cart",
  reviews: "reviews",
  faq: "faq",
  refundRequests: "refund-requests",
  shippingSettings: "shipping-settings",
  flashSaleProducts: "flash-sale-products",
  offersResourceProduct: "offersResourceProduct",
  customerProfile: "customer-profile",
  productCategories: "product-categories",
  activeProductCategories: "active-product-categories",
  productBrands: "product-brands",
  productAttributes: "product-attributes",
  productBenefit: "product-benefit",
  mainCategories: "main-categories",
  userRoles: "user-roles",
  heroBanners: "hero-banners",
  banners: "banners",
  vendors: "vendors",
  products: "products",
  productFaqs: "product-faqs",
  restockRequest: "restock-request",
  comboProducts: "combo-products",
  activeVendors: "active-vendors",
  customers: "customers",
  activeCustomers: "active-customers",
  managers: "managers",
  activeManagers: "active-managers",
  admins: "admins",
  brands: "brands",
  customerAddress: "customer-address",
  customerPaymentMethods: "customer-payment-methods",
  customerOrders: "customer-orders",
  customerRefunds: "customer-refunds",
  orders: "orders",
  activityLog: "activity-log",
  inHouseProducts: "in-house-products",
  vendorProducts: "vendor-products",
  vendorComboProducts: "vendor-combo-products",
  damagedStockUnits: "damaged-stock-units",
  stockUnits: "stock-units",
  requestReStock: "request-restock",
  offers: "offers",
  coupons: "coupons",
  offersById: "offersById",
  customer: "customer",
  order: "order",
  announcement: "announcement",
  businessSettings: "business-settings",
  settings: "settings",
  review: "review",
  inHouseShop: "in-house-shop",
  comboOffers: "combo-offers",
  helpSupport: "helpSupport"
};

export const tableIds = {
  productCategory: "product-category",
  productBrand: "product-brand",
  productAttribute: "product-attribute"
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export enum SellerAccountStatus {
  LIVE = "live",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
  ON_VACATION = "on_vacation"
}

export const SELLER_ACCOUNT_STATUS_OPTIONS = Object.values(SellerAccountStatus).map(value => ({
  label: value.replace(/_/, " "),
  value
}));

export enum ORDER_ACTIVITY_LOG_TYPE {
  PRODUCT = "product",
  COMBO_PRODUCT = "combo_product",
  VENDOR_PRODUCT = "vendor_product",
  VENDOR_COMBO_PRODUCT = "vendor_combo_product",
  PRODUCT_REQUEST = "product_request",
  REFUND = "refund",
  CATEGORY = "category",
  BRAND = "brand",
  SELLER = "seller",
  CUSTOMER = "customer",
  ORDER = "order",
  REVIEW = "review",
  OFFER = "offer",
  BANNER = "banner",
  ANNOUNCEMENT = "announcement",
  INHOUSE = "inhouse",
  BUSINESS_SETTINGS = "business_settings",
  SETTINGS = "settings",
  LANDING_SECTION = "landing_section"
}
export enum ORDER_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  // OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED"
}

export enum REFUND_STATUS {
  PENDING = "pending",
  //   APPROVED = "approved",
  REJECTED = "rejected",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded"
}

export enum REFUND_ITEM_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  REFUNDED = "refunded"
}

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS).map(value => ({
  label: value,
  value
}));

export const REFUND_STATUS_OPTIONS = Object.values(REFUND_STATUS).map(value => ({
  label: value,
  value
}));

export enum SellerVerificationStatus {
  VERIFIED = "verified",
  REJECTED = "rejected",
  NON_VERIFIED = "non_verified"
}

export const SELLER_VERIFICATION_STATUS_OPTIONS = Object.values(SellerVerificationStatus).map(value => ({
  label: value.replace(/_/, " "),
  value
}));

export enum PaymentMethodType {
  BKASH = "bkash",
  BANK = "bank",
  CASH = "cash"
}

export enum ShopType {
  INHOUSE = "inhouse",
  DEFAULT = "default"
}

export enum DisputeStatus {
  PROCESSING = "processing",
  RESOLVED = "resolved"
}

export enum BusinessType {
  PRIVATE_LIMITED_COMPANY = "private_limited_company",
  PUBLIC_LIMITED_COMPANY = "public_limited_company",
  INDIVIDUAL = "individual",
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  COMPANIES_LIMITED_BY_GUARANTEE = "companies_limited_by_guarantee",
  COMPANY_WITH_UNLIMITED_LIABILITY = "company_with_unlimited_liability"
}

export enum IdentityType {
  NID = "nid",
  PASSPORT = "passport"
}

export const identityTypeOptions = Object.values(IdentityType).map(value => ({
  label: value
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  value
}));

export const storeCategories = [
  { label: "Private Limited Company", value: "private_limited_company" },
  { label: "Public Limited Company", value: "public_limited_company" },
  { label: "Individual", value: "individual" },
  { label: "Companies limited by guarantee", value: "companies_limited_by_guarantee" },
  { label: "Companies with unlimited liabilities", value: "companies_with_unlimited_liabilities" },
  { label: "Sole Proprietorship", value: "sole_proprietorship" }
];

export enum BannerType {
  MAIN_SECTION_BANNER = "MAIN_SECTION_BANNER",
  FLASH_SALE = "FLASH_SALE",
  COMBO_OFFER = "COMBO_OFFER",
  BEST_DEAL = "BEST_DEAL"
}

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}

export const PAYMENT_STATUS_OPTIONS = Object.values(PAYMENT_STATUS).map(value => ({
  label: value,
  value
}));

export enum PAYMENT_METHOD {
  CASH = "CASH",
  CARD = "CARD",
  NET_BANKING = "NET_BANKING"
}

export const PAYMENT_METHOD_OPTIONS = Object.values(PAYMENT_METHOD).map(value => ({
  label: value,
  value
}));

export enum UNIT {
  PC = "pc",
  KG = "kg",
  LITER = "liter"
}

export enum DISCOUNT_TYPE {
  PERCENTAGE = "percentage",
  FLAT = "flat"
}

export enum PRODUCT_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  DENIED = "denied"
}

export const PRODUCT_STATUS_OPTIONS = Object.values(PRODUCT_STATUS).map(value => ({
  label: value,
  value
}));

export enum UPDATE_REQUEST_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum Weight {
  LIGHTWEIGHT = "lightweight",
  MEDIUMWEIGHT = "mediumweight",
  HEAVYWEIGHT = "heavyweight"
}

export enum SystemType {
  ALL = "ALL",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER"
}

export const SYSTEM_TYPES = Object.values(SystemType);

export const SYSTEM_TYPE_OPTIONS = [
  {
    value: SystemType.ALL,
    label: "All System"
  },
  {
    value: SystemType.CUSTOMER,
    label: "User Website"
  },
  {
    value: SystemType.SELLER,
    label: "Vendor Panel"
  }
];

export enum AnnouncementType {
  INFORMATION = "INFORMATION",
  ALERT = "ALERT",
  PROMOTION = "PROMOTION",
  UPDATE = "UPDATE"
}

export type AnnouncementTypeVariants = keyof typeof AnnouncementType;

export const ANNOUNCEMENT_TYPE_OPTIONS = [
  { label: "Information", value: AnnouncementType.INFORMATION },
  { label: "Alert", value: AnnouncementType.ALERT },
  { label: "Promotion", value: AnnouncementType.PROMOTION },
  { label: "Update", value: AnnouncementType.UPDATE }
];

export enum AnnouncementDisplayStyle {
  BANNER_BAR = "BANNER_BAR",
  POPUP = "POPUP",
  SCROLLING_MESSAGE = "SCROLLING_MESSAGE"
}

export type AnnouncementDisplayStyleVariants = keyof typeof AnnouncementDisplayStyle;

export const ANNOUNCEMENT_DISPLAY_STYLE_OPTIONS = [
  { label: "Banner Bar", value: AnnouncementDisplayStyle.BANNER_BAR },
  { label: "Popup", value: AnnouncementDisplayStyle.POPUP },
  { label: "Scrolling Message", value: AnnouncementDisplayStyle.SCROLLING_MESSAGE }
];

export enum DeliveryResponsibility {
  SELLER = "seller",
  ADMIN = "admin"
}

export const DELIVERY_RESPONSIBILITIES = Object.values(DeliveryResponsibility);

export enum ShippingZone {
  INSIDE_DHAKA = "inside_dhaka",
  OUTSIDE_DHAKA = "outside_dhaka",
  NEAR_DHAKA = "near_dhaka"
}

export const ZONE_LABELS: Record<string, string> = {
  [ShippingZone.INSIDE_DHAKA]: "Inside Dhaka",
  [ShippingZone.OUTSIDE_DHAKA]: "Outside Dhaka",
  [ShippingZone.NEAR_DHAKA]: "Near Dhaka"
};

export const SHIPPING_ZONES = Object.values(ShippingZone);

export enum RESOURCE_TYPE {
  CATEGORY = "category",
  CUSTOM = "custom",
  STORE = "store",
  FLASH_SALE = "flash_sale",
  TODAYS_DEAL = "todays_deal"
}
