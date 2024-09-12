import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DATE_DEFAULT_FORMAT, DATE_TIME_DEFAULT_FORMAT } from "../../../utils";
import TextBoxWidget from "./TextBoxWidget";

const DateWidget = ({ value, schema }) => {
  return (
    <TextBoxWidget
      value={
        value &&
        dayjs(value).format(
          schema.customFormat ||
            (schema.format === "date-time"
              ? DATE_TIME_DEFAULT_FORMAT
              : DATE_DEFAULT_FORMAT),
        )
      }
      Icon={CalendarOutlined}
    />
  );
};

export default DateWidget;
