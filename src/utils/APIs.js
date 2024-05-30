let BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const filterCar = async (data, queryUrl) => {
  const res = await fetch(BaseUrl + `/filter-vehicle?${queryUrl}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let response = await res.json();
  return response.data;
};
export const getTripDetails = async (data) => {
  const res = await fetch(BaseUrl + `/manage-booking`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let response = await res.json();
  return response.data;
};
export const getHomeData = async (data) => {
  const res = await fetch(
    BaseUrl +
      `/home?lang_id=${data.lang}&${
        data.role_id ? `role_id=${data.role_id}` : ""
      }`,
    {
      method: "GET",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await res.json();
};
export const checkManageBooking = async (data) => {
  const res = await fetch(BaseUrl + `manage-booking`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const checkManageBooking_new = async (data) => {
  const res = await fetch(BaseUrl + `manage-booking-new`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
