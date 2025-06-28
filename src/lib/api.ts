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
  GET_CUSTOMERS: `${BASE_URL}/users/customers`,
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
    CREATE_REPORT: `${BASE_URL}/reports`, 
  GET_ALL_REPORTS: `${BASE_URL}/reports`, 
  GET_REPORTS_BY_TARGET: (userId: string) =>
    `${BASE_URL}/reports/target/${userId}`, 

  BAN_USER: (id: string)   => `${BASE_URL}/users/ban/${id}`,
  UNBAN_USER: (id: string) => `${BASE_URL}/users/unban/${id}`,

} as const;

export default ApiConstants;
