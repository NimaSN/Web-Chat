import moment from "jalali-moment";

//* Start Number Utils
export const numberSeparate = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
//* End Number Utils

//* Start Date Utils
export const formatToPersianDate = (
  date,
  format = "YYYY/MM/DD",
  locale = "fa"
) => {
  if (!date) return;
  return moment(date).locale(locale).format(format);
};
//* End Date Utils
