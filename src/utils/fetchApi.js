import axios from "axios";

const BASE_URL = "https://youtube-v31.p.rapidapi.com";

const options = {
  url: BASE_URL,
  params: {
    maxResults: "50",
  },
  headers: {
    "X-RapidAPI-Key": "50b8d7c639mshe15691f6dc83378p1af1a5jsnd7bc1b2b482a",
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
};

const fetchApi = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);
  return data;
};

export default fetchApi;
