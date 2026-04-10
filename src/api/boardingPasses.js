import api from "./api";

export const getMyBoardingPasses = async () => {
  const res = await api.get("/bookings/my/boarding-passes");
  return res.data;
};
