import { ORDER_STATUS } from "./constant";

const apiRoutes = {
  publicRoutes: {
    adminSignIn: "/api/admin/auth/login",
    customerSignIn: "/api/customer/login",
    customerRegister: "/api/customer/register",
    customerOtpVerify: "/api/customer/otp-verify",
    uploadImage: "/api/upload/single-img",
    deleteImageByURL: "/api/upload/single-img",
    getTempImagesCount: "/api/upload/temp-img",
    deleteAllTempImages: "/api/upload/temp-img",

    deleteImage: "/api/v1/storage/delete",
    uploadMultipleImages: "/api/v1/storage/upload-multiple",
    mainCategories: "/api/v1/customers/categories",
    heroBanners: "/api/v1/customers/hero-banners",
    brands: "/api/v1/customers/brands",
    banners: "/api/v1/customers/banners",
    customerSendOtp: "/api/v1/customers/auth/send-otp",
    customerSendSignupOtp: "/api/v1/customers/auth/send-signup-otp",
    customerVerifyOtp: "/api/v1/customers/auth/verify-otp",
    customerSignupVerifyOtp: "/api/v1/customers/auth/verify-signup-otp",
    flashSaleProducts: "/api/v1/customers/offers/flash-sale"
  },
  privateRoutes: {
    admin: {
      profile: "/api/admin/auth/me",
      changePassword: "/api/admin/auth/password",
      updateProfile: "/api/admin/auth/me",
      adminList: "/api/v1/admin/users",
      adminListNoPagination: "/api/v1/admin/users/all",
      teamMember: {
        create: `/api/admin/manage/team-member`,
        get: `/api/admin/manage/team-member`,
        getById: (id: string) => `/api/admin/manage/team-member/${id}`,
        update: (id: string) => `/api/admin/manage/team-member/${id}`,
        delete: (id: string) => `/api/admin/manage/team-member/${id}`,
        sort: `/api/admin/manage/team-member/sort`
      },
      customer: {
        getCustomers: "/api/v1/admin/customers",
        getSingleCustomer: (id: string) => `/api/v1/admin/customers/${id}`,
        getSingleCustomerOrders: (id: string) => `/api/v1/admin/customers/${id}/orders`
      },

      offersManagement: {
        offersList: {
          get: `/api/v1/admin/offers`,
          getById: (id: string) => `/api/v1/admin/offers/${id}`,
          create: `/api/v1/admin/offers`,
          update: (id: string) => `/api/v1/admin/offers/${id}`,
          delete: (id: string) => `/api/v1/admin/offers/${id}`,
          sort: `/api/v1/admin/offers/sort`,
          createProduct: (id: string) => `/api/v1/admin/offers/${id}/product`
        },
        banner: {
          get: `/api/v1/admin/banners`,
          getById: (id: string) => `/api/v1/admin/banners/${id}`,
          create: `/api/v1/admin/banners`,
          update: (id: string) => `/api/v1/admin/banners/${id}`,
          delete: (id: string) => `/api/v1/admin/banners/${id}`
        }
      },
      orderManagement: {
        updateOrderById: (id: string) => `/api/v1/admin/orders/${id}`,
        getOrderById: (id: string) => `/api/v1/admin/orders/${id}`,
        getOrderByVendorId: (id: string, vendorId: string) => `/api/v1/admin/sellers/${vendorId}/orders/${id}`,
        getOrders: `/api/v1/admin/orders`,
        getRefundRequests: (id?: string) => `/api/v1/admin/refunds${id ? `/${id}` : ""}`,
        refundAllById: (id: string) => `/api/v1/admin/refunds/${id}/refund-all`,
        refundPartially: (id: string) => `/api/v1/admin/refunds/${id}/refund`,
        rejectRefundPartially: (id: string) => `/api/v1/admin/refunds/${id}/reject`,
        rejectRefundAllById: (id: string) => `/api/v1/admin/refunds/${id}/reject-all`
      },
      activityLog: {
        getActivityLog: (resourceType: string, resourceId?: string) =>
          `/api/v1/admin/activities?resourceType=${resourceType}${resourceId ? `&resourceId=${resourceId}` : ""}`
      },
      userRole: {
        get: `/api/v1/admin/roles`,
        getById: (id: string) => `/api/v1/admin/roles/${id}`,
        create: `/api/v1/admin/roles`,
        update: (id: string) => `/api/v1/admin/roles/${id}`,
        delete: (id: string) => `/api/v1/admin/roles/${id}`
      },
      settings: {
        get: `/api/v1/admin/settings`,
        updatePolicy: (id: string) => `/api/v1/admin/settings/policy/${id}`,
        addPolicy: `/api/v1/admin/settings/policy`
      },
      productManagement: {
        productCategory: {
          get: `/api/admin/category`,
          getById: (id: string) => `/api/admin/category/${id}`,
          create: `/api/admin/category`,
          update: (id: string) => `/api/admin/category/${id}`,
          delete: (id: string) => `/api/admin/category/${id}`,
          sort: `/api/admin/category/sort`
        },
        product: {
          get: `/api/admin/product`,
          getById: (id: string) => `/api/admin/product/${id}`,
          create: `/api/admin/product`,
          update: (id: string) => `/api/admin/product/${id}`,
          delete: (id: string) => `/api/admin/product/${id}`
        }
      }
    },
    customer: {
      profile: "/api/v1/customers/auth/me",
      account: {
        update: "/api/v1/customers/account",
        getAddress: "/api/v1/customers/account/address",
        addAddress: "/api/v1/customers/account/address",
        updateAddress: (id: string) => `/api/v1/customers/account/address/${id}`,
        deleteAddress: (id: string) => `/api/v1/customers/account/address/${id}`,
        getPaymentMethods: "/api/v1/customers/account/payment-methods",
        addPaymentMethod: "/api/v1/customers/account/payment-methods",
        updatePaymentMethod: (id: string) => `/api/v1/customers/account/payment-methods/${id}`,
        deletePaymentMethod: (id: string) => `/api/v1/customers/account/payment-methods/${id}`,
        setDefaultPaymentMethod: (id: string) => `/api/v1/customers/account/payment-methods/${id}/default`,
        getOrders: ({ status, page, limit }: { status?: ORDER_STATUS; page?: number; limit?: number }) =>
          `/api/v1/customers/orders?${status ? `status=${status}` : ""}${page ? `&page=${page}` : ""}${limit ? `&limit=${limit}` : ""}`,
        getOrder: (orderId: string) => `/api/v1/customers/orders/${orderId}`,
        cancelOrder: (id: string) => `/api/v1/customers/orders/${id}/cancel`,
        requestRefund: (id: string) => `/api/v1/customers/orders/${id}/refund`,
        getRefunds: (query: string) => `/api/v1/customers/refunds?${query}`
      }
    },
    dropdownList: {
      store: `/api/v1/admin/sellers/dropdown`,
      products: `/api/v1/admin/products/dropdown`,
      comboOffers: `/api/v1/admin/combo-products/dropdown`
    }
  }
};

export default apiRoutes;
