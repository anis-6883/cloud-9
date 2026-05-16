const routes = {
  publicRoutes: {
    home: "/",
    trackOrder: "/track-order",
    cart: "/cart",
    adminLogin: "/root-lab/admin/login",
    policy: "/policy",
    terms: "/terms",
    brands: "/brands",
    productList: `/product-list`,
    comboOffer: `/combo-offers`,
    productDetail: (id: string) => `/product-list/${id}`,
    checkout: "/checkout",
    orderNow: "/order-now"
  },
  privateRoutes: {
    admin: {
      orders: {
        home: "/admin/order-management/order",
        view: (id: string) => `/admin/order-management/order/${id}`
      },
      dashboard: "/admin/dashboard",
      productManagement: {
        productCategory: {
          home: "/admin/product-management/product-category",
          create: "/admin/product-management/product-category/create",
          edit: (id: string) => `/admin/product-management/product-category/edit/${id}`
        },
        brand: {
          home: "/admin/product-management/brand",
          create: "/admin/product-management/brand/create",
          edit: (id: string) => `/admin/product-management/brand/edit/${id}`
        },
        productAttribute: {
          home: "/admin/product-management/product-attribute",
          create: "/admin/product-management/product-attribute/create",
          edit: (id: string) => `/admin/product-management/product-attribute/edit/${id}`
        },
        productBenefit: {
          home: "/admin/product-management/product-benefit",
          create: "/admin/product-management/product-benefit/create",
          edit: (id: string) => `/admin/product-management/product-benefit/edit/${id}`
        },
        addNewProduct: "/admin/product-management/add-new-product",
        inHouseProduct: {
          home: "/admin/product-management/in-house-product",
          create: "/admin/product-management/in-house-product/create",
          edit: (id: string) => `/admin/product-management/in-house-product/edit/${id}`,
          show: (id: string) => `/admin/product-management/in-house-product/show/${id}`,
          showVariants: (id: string) => `/admin/product-management/in-house-product/show/${id}/variant`
        },
        damageProduct: {
          home: "/admin/product-management/damage-product",
          create: "/admin/product-management/damage-product/create",
          edit: (id: string) => `/admin/product-management/damage-product/edit/${id}`,
          show: (id: string) => `/admin/product-management/damage-product/show/${id}`
        },
        productFAQ: {
          home: "/admin/product-management/product-faq",
          create: "/admin/product-management/product-faq/create",
          edit: (id: string) => `/admin/product-management/product-faq/edit/${id}`
        },
        requestReStockList: {
          home: "/admin/product-management/request-re-stock-list",
          create: "/admin/product-management/request-re-stock-list/create",
          edit: (id: string) => `/admin/product-management/request-re-stock-list/edit/${id}`
        },
        comboOffer: {
          home: "/admin/product-management/combo-offer",
          create: "/admin/product-management/combo-offer/create",
          edit: (id: string) => `/admin/product-management/combo-offer/edit/${id}`,
          show: (id: string) => `/admin/product-management/combo-offer/show/${id}`,
          showVariants: (id: string) => `/admin/product-management/combo-offer/show/${id}/variant`,
          comboBanner: "/admin/product-management/combo-banner"
        },
        vendorProduct: {
          home: "/admin/product-management/vendor-product",
          create: "/admin/product-management/vendor-product/create",
          edit: (id: string) => `/admin/product-management/vendor-product/edit/${id}`,
          view: (id: string) => `/admin/product-management/vendor-product/${id}`,
          viewVariants: `/admin/product-management/vendor-product/section-banner`
        },
        productUpdateRequests: {
          home: "/admin/product-management/update-request",
          edit: (id: string) => `/admin/product-management/update-request/edit/${id}`
        }
      },
      orderManagement: {
        order: {
          home: "/admin/order-management/order"
        },
        refundRequest: {
          home: "/admin/order-management/refund-request",
          view: (id: string) => `/admin/order-management/refund-request/${id}`
        }
      },
      productReview: {
        home: "/admin/product-review"
      },

      offerAndDealsManagement: {
        offerList: {
          home: "/admin/offers-management/offers",
          create: "/admin/offers-management/offers/create",
          addProduct: (offerId: string) => `/admin/offers-management/offers/add-products/${offerId}`
        },
        coupon: {
          home: "/admin/offers-management/coupon",
          create: "/admin/offers-management/coupon/create"
        }
      },
      userManagement: {
        vendor: {
          home: "/admin/user-management/vendor/vendor-list",
          create: "/admin/user-management/vendor/vendor-list/create",
          edit: (id: string) => `/admin/user-management/vendor/vendor-list/edit/${id}`,
          view: (id: string) => `/admin/user-management/vendor/vendor-list/${id}`,
          moneyWithdraw: "/admin/user-management/vendor/money-withdraw",
          orderDetails: (vendorId: string, orderId: string) => `/admin/user-management/vendor/vendor-list/${vendorId}/order/${orderId}`,
          offerDetails: (vendorId: string, offerId: string) =>
            `/admin/user-management/vendor/vendor-list/${vendorId}/offers-and-deals/add-product/${offerId}`,
          productDetails: (vendorId: string, productId: string) =>
            `/admin/user-management/vendor/vendor-list/${vendorId}/product/${productId}`,
          productEdit: (vendorId: string, productId: string) =>
            `/admin/user-management/vendor/vendor-list/${vendorId}/product/${productId}/edit`,
          comboProductDetails: (vendorId: string, productId: string) =>
            `/admin/user-management/vendor/vendor-list/${vendorId}/combo-product/${productId}`,
          comboProductEdit: (vendorId: string, productId: string) =>
            `/admin/user-management/vendor/vendor-list/${vendorId}/combo-product/${productId}/edit`
        },
        customer: {
          home: "/admin/user-management/customer",
          view: (id: string) => `/admin/user-management/customer/${id}`,
          order: (id: string, orderId: string) => `/admin/user-management/customer/${id}/order/${orderId}`
        },
        manager: {
          home: "/admin/user-management/manager",
          create: "/admin/user-management/manager/register",
          edit: (id: string) => `/admin/user-management/manager/edit/${id}`
        }
      },
      inhouseShop: "/admin/inhouse-shop",
      inhouseShopEdit: "/admin/inhouse-shop/edit",
      banners: "/admin/banners",
      userRole: "/admin/user-role",
      announcementSetup: "/admin/announcement-setup",
      helpAndSUpport: {
        contactMail: {
          home: "/admin/help-support/contact-mail",
          view: (id: string) => `/admin/help-support/contact-mail/${id}`
        }
      },
      businessSettings: `/admin/business-settings`,
      settings: `/admin/settings`
    },
    user: {
      profile: "/profile",
      address: "/address",
      coupons: "/coupons",
      myQuestions: "/my-questions",
      orders: "/orders",
      orderDetails: (id: string) => `/orders/${id}`,
      paymentMethods: "/payment-methods",
      refund: "/refund",
      wishlist: "/wishlist"
    }
  }
};

export default routes;
