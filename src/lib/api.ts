const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = "https://fasent-api.onrender.com/api";

const ApiConstants = {
  //Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  //User
  GET_CURRENT_USER: `${BASE_URL}/users/me`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  UPDATE_USER: `${BASE_URL}/users/change-info`,
  UPDATE_AVATAR: `${BASE_URL}/users/change-avatar`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  //Product
  LIST_PRODUCTS: `${BASE_URL}/products`,
  GET_PRODUCTS_OF_STORE: (storeId: string) =>
    `${BASE_URL}/products/store/${storeId}`,
  GET_PRODUCT_BY_ID: (productId: string) => `${BASE_URL}/products/${productId}`,
  STORES: `${BASE_URL}/stores`,
  //Store
  GET_STORE_BY_ID: (storeId: string) => `${BASE_URL}/stores/${storeId}`,
  //Rental
  GET_USER_RENTALS: `${BASE_URL}/rentals/user/me`,
  RENTALS: `${BASE_URL}/rentals`,
  //Payment
  GET_CUSTOMER_PAYMENTS: (customerId: string) =>
    `${BASE_URL}/payments/customer/${customerId}`,
  //Feedback
  FEEDBACK: `${BASE_URL}/feedbacks`,
  GET_STORE_FEEDBACK: (storeId: string) =>
    `${BASE_URL}/feedbacks/store/${storeId}`,
} as const;

export default ApiConstants;
