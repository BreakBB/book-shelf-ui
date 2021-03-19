import React, {useState} from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from "@material-ui/core/IconButton";
import "react-datepicker/dist/react-datepicker.css";
import "./DataRow.css"
import dayjs, {Dayjs} from "dayjs";
import {LocalizedDatePicker} from "../../ComponentLib/LocalizedDatePicker";

interface Props {
    title: string,
    value: Dayjs,
    onChangeDone: (Dayjs) => void
}

function DateDataRow(props: Props): JSX.Element {
    const theme = useTheme();
    const [editMode, setEditMode] = useState(false);
    const [rowValue, setRowValue] = useState(props.value);

    const handleChangeDone = () => {
        if (props.value.diff(rowValue)) {
            props.onChangeDone(rowValue);
        }
        setEditMode(false);
    }

    return (
        <tr className="data-row">
            <td className="data-key" style={{color: theme.palette.text.secondary}}>{props.title}</td>
            {editMode
                ? <>
                    <td className="data-value">
                        <LocalizedDatePicker id="releaseDate" selected={rowValue.toDate()} onChange={(newDate) => setRowValue(dayjs(newDate))}/>
                        <IconButton style={{marginLeft: "auto"}} onClick={handleChangeDone}>
                            <DoneIcon />
                        </IconButton>
                    </td>
                </>
                : <>
                    <td className="data-value">
                        <span>{props.value.format("DD.MM.YYYY")}</span>
                        <IconButton style={{marginLeft: "auto"}} onClick={() => setEditMode(true)}>
                            <EditIcon />
                        </IconButton>
                    </td>
                </>
            }
        </tr>
    );
}

export default DateDataRow;