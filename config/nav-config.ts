import { PERMISSIONS } from "@/config/constants";
import routes from "@/config/routes";
import {
  ChartNoAxesGantt,
  Frame,
  Headset,
  Images,
  LayoutDashboard,
  Megaphone,
  PieChart,
  Shapes,
  UserRoundCog,
  Users2,
  Utensils
} from "lucide-react";

// import { BsGlobe2 } from "react-icons/bs";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { LuBox } from "react-icons/lu";
import { MdInsertChartOutlined } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";

const r = routes.privateRoutes.admin;

// ── Nav item type ──────────────────────────────────────────────────────────────

export type NavItem = {
  title: string;
  url?: string;
  icon?: any;
  key?: string; // matches a key in NAV_PERMISSION_MAP
  items?: NavItem[];
};

// ── key → permission ───────────────────────────────────────────────────────────

export const NAV_PERMISSION_MAP: Record<string, string> = {
  dashboard: PERMISSIONS.DASHBOARD,
  product_categories: PERMISSIONS.PRODUCT_CATEGORIES,
  product_brand: PERMISSIONS.PRODUCT_BRAND,
  product_attributes: PERMISSIONS.PRODUCT_ATTRIBUTES,
  product_benefit: PERMISSIONS.PRODUCT_BENEFIT_SETUP,
  inhouse_products: PERMISSIONS.INHOUSE_PRODUCTS,
  vendor_products: PERMISSIONS.VENDOR_PRODUCTS,
  combo_offer: PERMISSIONS.COMBO_OFFER,
  combo_banner: PERMISSIONS.COMBO_BANNER,
  damage_product: PERMISSIONS.DAMAGE_PRODUCT,
  request_restock: PERMISSIONS.REQUEST_RESTOCK,
  product_update_request: PERMISSIONS.PRODUCT_UPDATE_REQUEST,
  user_vendor: PERMISSIONS.USER_VENDOR,
  money_withdraw: PERMISSIONS.MONEY_WITHDRAW,
  user_customer: PERMISSIONS.USER_CUSTOMER,
  user_manager: PERMISSIONS.USER_MANAGER,
  order: PERMISSIONS.ORDER,
  refund_request: PERMISSIONS.REFUND_REQUEST,
  product_review: PERMISSIONS.PRODUCT_REVIEW,
  offers_and_deals: PERMISSIONS.OFFERS_AND_DEALS,
  banner_setup: PERMISSIONS.BANNER_SETUP,
  user_role_setup: PERMISSIONS.USER_ROLE_SETUP,
  announcement_setup: PERMISSIONS.ANNOUNCEMENT_SETUP,
  help_and_support: PERMISSIONS.HELP_AND_SUPPORT,
  business_settings: PERMISSIONS.BUSINESS_SETTINGS,
  inhouse_shop: PERMISSIONS.INHOUSE_SHOP,
  settings: PERMISSIONS.SETTINGS
};

// ── Sidebar nav menu ───────────────────────────────────────────────────────────

export const adminDashboardMenu = {
  teams: [{ name: "Cloud 9", logo: Utensils }],

  navMain: [
    { title: "Dashboard", url: r.dashboard, icon: LayoutDashboard, key: "dashboard" },
    {
      title: "Product Management",
      url: "#",
      icon: GiFullMotorcycleHelmet,
      items: [
        { title: "Categories", url: r.productManagement.productCategory.home, key: "product_categories" },
        { title: "Brands", url: r.productManagement.brand.home, key: "product_brand" },
        { title: "Attributes", url: r.productManagement.productAttribute.home, key: "product_attributes" },
        { title: "Setup Benefits", url: r.productManagement.productBenefit.home, key: "product_benefit" },
        { title: "Add New Product", url: r.productManagement.addNewProduct, key: "add_new_product" },
        { title: "In-house Products", url: r.productManagement.inHouseProduct.home, key: "inhouse_products" },
        { title: "Vendor Products", url: r.productManagement.vendorProduct.home, key: "vendor_products" },
        {
          title: "Combo Offers",
          url: r.productManagement.comboOffer.home,

          items: [
            { title: "Combo Offer List", url: r.productManagement.comboOffer.home, key: "combo_offer" },
            { title: "Combo Banner", url: r.productManagement.comboOffer.comboBanner, key: "combo_banner" }
          ]
        },
        { title: "Damage Products", url: r.productManagement.damageProduct.home, key: "damage_product" },
        { title: "Product FAQ", url: r.productManagement.productFAQ.home, key: "product_faq" },
        { title: "Re-stock Requests", url: r.productManagement.requestReStockList.home, key: "request_restock" }
        // { title: "Update Request", url: r.productManagement.productUpdateRequests.home, key: "product_update_request" },
      ]
    },
    {
      title: "User Management",
      url: "#",
      icon: Users2,
      items: [
        {
          title: "Vendors",
          url: "#",
          items: [
            { title: "Vendor List", url: r.userManagement.vendor.home, key: "user_vendor" },
            { title: "Money Withdraw", url: r.userManagement.vendor.moneyWithdraw, key: "money_withdraw" }
          ]
        },
        { title: "Customers", url: r.userManagement.customer.home, key: "user_customer" },
        { title: "Managers", url: r.userManagement.manager.home, key: "user_manager" }
      ]
    },
    {
      title: "Order Management",
      url: "#",
      icon: LuBox,
      items: [
        { title: "Orders", url: r.orderManagement.order.home, key: "order" },
        { title: "Refund Requests", url: r.orderManagement.refundRequest.home, key: "refund_request" }
      ]
    },
    {
      title: "Offers & Deals",
      url: "#",
      icon: RiDiscountPercentLine,
      items: [
        { title: "Offers", url: r.offerAndDealsManagement.offerList.home, key: "offer_list" },
        { title: "Coupons", url: r.offerAndDealsManagement.coupon.home, key: "coupon" }
      ]
    },
    { title: "Product Reviews", url: r.productReview.home, icon: ChartNoAxesGantt, key: "product_review" },
    { title: "Banners", url: r.banners, icon: Images, key: "banner_setup" },
    { title: "User Roles", url: r.userRole, icon: UserRoundCog, key: "user_role_setup" },
    { title: "Announcements", url: r.announcementSetup, icon: Megaphone, key: "announcement_setup" },
    { title: "Help & Support", url: r.helpAndSUpport.contactMail.home, icon: Headset, key: "help_and_support" },
    { title: "Business Settings", url: r.businessSettings, icon: MdInsertChartOutlined, key: "business_settings" },
    { title: "Inhouse Shop", url: r.inhouseShop, icon: Shapes, key: "inhouse_shop" }
    // { title: "Site Settings", url: r.settings, icon: BsGlobe2, key: "settings" }
  ] as NavItem[],

  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart }
  ]
};
