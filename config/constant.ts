export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ROLE = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  SELLER: "seller"
};

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 1,
  MAX_ATTEMPTS: 5
} as const;

export const allRoutes = {
  comboOffer: "/combo-offer",
  trackOrder: "/track-order",
  brands: "/brands",
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
  bestSellers: "/product-list",
  sellerProfile: "/seller-profile",
  categories: "/categories",
  login: "/login",
  howToSell: "/how-to-sell",
  support: "/support",
  cart: "/cart",
  checkout: "/checkout"
};

export const cacheTags = {
  adminProfile: "admin-profile",
  manageTeamMember: "manage-team-member"
};

export const tableIds = {
  productCategory: "product-category",
  productBrand: "product-brand",
  productAttribute: "product-attribute"
};

export enum ORDER_STATUS {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COOKING = "cooking", // "processing"
  SHIPPED = "shipped",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  FAILED = "failed"
}

export enum CANCELLED_BY {
  CUSTOMER = "customer",
  RESTAURANT = "restaurant",
  SYSTEM = "system"
}

export enum REFUND_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded"
}

export enum REFUND_ITEM_STATUS {
  PENDING = "pending",
  REJECTED = "rejected",
  REFUNDED = "refunded"
}

export enum DISPUTE_STATUS {
  OPENED = "opened", // customer raised a dispute
  UNDER_REVIEW = "under_review", // support team investigating
  RESOLVED = "resolved", // resolved in customer's favor → triggers REFUNDED
  REJECTED = "rejected" // dispute denied
}

export enum DISPUTE_REASON {
  NOT_DELIVERED = "not_delivered",
  WRONG_ITEMS = "wrong_items",
  DAMAGED_ITEMS = "damaged_items",
  BILLING_ISSUE = "billing_issue",
  QUALITY_ISSUE = "quality_issue"
}

export enum PAYMENT_METHOD_TYPE {
  CASH = "cash",
  ONLINE = "online"
}

export enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
  FAILED = "failed"
}
