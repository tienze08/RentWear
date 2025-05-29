const BASE_URL = "http://localhost:5000/api";

const ApiConstants = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  GET_CURRENT_USER: `${BASE_URL}/users/me`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
  UPDATE_USER: `${BASE_URL}/users/change-info`,
  UPDATE_AVATAR: `${BASE_URL}/users/change-avatar`,
  LIST_STORES: `${BASE_URL}/stores`,
  LIST_PRODUCTS : `${BASE_URL}/products`
} as const;

export default ApiConstants;
