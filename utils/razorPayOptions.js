let RAZOR_PAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

const razorpayOptions = ({
  name, email, contact, amount, description, callback, order_id,
}) => ({
  key: RAZOR_PAY_KEY, // Enter the Key ID generated from the Dashboard
  amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: 'INR',
  name: 'COLLEGEDUNIA',
  order_id,
  description,
  image: 'https://images.collegedunia.com/public/asset/img/logo_new.png',
  handler: callback,
  prefill: {
    name,
    email,
    contact,
  },
  notes: {
    address: 'Collegedunia Web Pvt. Ltd.',
  },
  theme: {
    color: '#ff7900',
  },
});

export default razorpayOptions;
