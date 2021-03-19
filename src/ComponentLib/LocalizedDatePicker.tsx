import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    id: string;
    selected: Date;
    onChange: (Date) => void;
}

export const LocalizedDatePicker = (props: Props): JSX.Element => {
    return <DatePicker
        id={props.id}
        dateFormat="dd.MM.yyyy"
        selected={props.selected}
        onChange={props.onChange}
    />
}