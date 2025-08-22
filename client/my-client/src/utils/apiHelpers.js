// src/utils/apiHelpers.js

export const buildQueryParams = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.append(key, value);
  });
  return query.toString(); // example: ?page=2&sort=name&order=asc
};
