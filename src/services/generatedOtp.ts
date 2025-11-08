const generatedOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
export default generatedOTP;
