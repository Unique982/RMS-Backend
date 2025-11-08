import axios from "axios";

interface IKhaltiData {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string | number;
  purchase_name: string | number;
}

//ttps://dev.khalti.com/api/v2/epayment/initiate/
const KhaltiPayment = async (data: IKhaltiData) => {
  const response = await axios.post(
    "https://dev.khalti.com/api/v2/epayment/initiate/",
    {
      return_url: data.return_url,
      website_url: data.website_url,
      amount: Math.round(data.amount * 100),
      purchase_order_id: data.purchase_order_id,
      purchase_name: data.purchase_name,
    },
    {
      headers: {
        Authorization: "Key 33ef2fcffa374d26b98c68a9f2c13f62",
      },
    }
  );
  return response;
};
export { KhaltiPayment };
