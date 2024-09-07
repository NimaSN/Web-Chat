import axios from "axios";

export const getTimeApi = () => {
  return axios.get("http://worldtimeapi.org/api/timezone/Asia/Tehran");
};

export const getCoinApi = (crypto) => {
  return axios.get(`https://rest.coinapi.io/v1/exchangerate/${crypto}/USD`, {
    headers: {
      "X-CoinAPI-Key": "78EE8D23-3E54-4A7B-9B43-86B765FF787F",
    },
  });
};
export const getDigikalaApi = (id) => {
  return axios.get(
    `https://one-api.ir/digikala/?token=222679:64d4bff45a89d&action=product&id=${id}`
  );
};
