export default function convertCartStateToArr(cartData = {}) {
  const data = [];
  Object.keys(cartData).forEach((key) => {
    data.push({
      college_id: key,
      course_tag: cartData[key],
    });
  });
  return JSON.stringify(data);
}
