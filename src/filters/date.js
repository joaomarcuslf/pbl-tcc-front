import moment from "moment";

export default function formatDateFilter(value, format = "DD/MM/YYYY", UTC) {
  let date = "";

  if (value) {
    date = moment(String(value));

    if (UTC) {
      date = date.utc();
    }

    date = date.format(format);
  }

  return date;
}
