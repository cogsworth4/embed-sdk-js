import axios from "axios";

const instance = ({ endpoint, headers = {} }) =>
  axios.create({
    url: endpoint, // Goes to the embed-app running locally
    headers: {
      common: {
        "Content-Type": "application/json",
        ...headers,
      },
    },
  });

export default instance;
