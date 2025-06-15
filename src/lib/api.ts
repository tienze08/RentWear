const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = "https://fasent-api.onrender.com/api";

const ApiConstants = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  GET_CURRENT_USER: `${BASE_URL}/users/me`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  UPDATE_USER: `${BASE_URL}/users/change-info`,
  UPDATE_AVATAR: `${BASE_URL}/users/change-avatar`,
  LIST_PRODUCTS: `${BASE_URL}/products`,
  GET_PRODUCTS_OF_STORE: (storeId: string) =>
    `${BASE_URL}/products/store/${storeId}`,
  GET_PRODUCT_BY_ID: (productId: string) => `${BASE_URL}/products/${productId}`,
  STORES: `${BASE_URL}/stores`,
  GET_STORE_BY_ID: (storeId: string) => `${BASE_URL}/stores/${storeId}`,
  GET_USER_RENTALS: `${BASE_URL}/rentals/user/me`,
  RENTALS: `${BASE_URL}/rentals`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,

  GET_CUSTOMERS: `${BASE_URL}/users/customers`,
} as const;

export default ApiConstants;
