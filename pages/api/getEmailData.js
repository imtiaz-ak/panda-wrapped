import { getToken } from 'next-auth/jwt';
import axios from 'axios'

const secret = 'ABCDEFG';
let accessToken;

// // const getData = async(token) => {
// //   // use axios to get the IDs of the user
// //   const response = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/profile`, {headers: {Authorization: `Bearer ${token}`}})
// //   return response ..
// // }

export default async (req, res) => {
  console.log('hello world')
  const data = {name:'home api route'}
  const token = await getToken({ req, secret });

  // accessToken = token.access_token;

  // const data = await getData(accessToken);

  res.status(200).json(token);
};