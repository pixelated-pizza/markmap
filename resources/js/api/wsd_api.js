const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL + "/api", 
  withCredentials: true,
});

export async function fetchWSD() {
  const { data } = await api.get("api/website_sale_details");
  return data;
}

export async function createWSD(wsd) {
  const { data } = await api.post("api/website_sale_details", wsd);
  return data;
}

export async function updateWSD(id, updates) {
  const { data } = await api.put(`api/website_sale_details/${id}`, updates);
  return data;
}

export async function deleteWSD(id) {
  await api.delete(`api/website_sale_details/${id}`);
  return true;
}

export async function fetchBlankWSD(wc_id) {
  const { data } = await api.get(`api/website_sale_details/blank/${wc_id}`);
  return data.data; 
}
