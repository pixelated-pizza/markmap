import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchWC() {
  const { data } = await api.get("/website_campaign");
  return data;
}

export async function createWC(campaign) {
  const { data } = await api.post("/website_campaign", campaign);
  return data;
}

export async function updateWC(id, updates) {
  const { data } = await api.put(`/website_campaign/${id}`, updates);
  return data;
}

export async function deleteWC(id) {
  await api.delete(`/website_campaign/${id}`);
  return true;
}


