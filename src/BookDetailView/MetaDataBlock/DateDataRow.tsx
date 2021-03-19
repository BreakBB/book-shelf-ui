import React, {useState} from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from "@material-ui/core/IconButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs, {Dayjs} from "dayjs";

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
            <td style={{width: "35%", color: theme.palette.text.secondary}}>{props.title}</td>
            {editMode
                ? <>
                    <td style={{width: "45%"}}>
                        <DatePicker id="releaseDate" selected={rowValue.toDate()} onChange={(newDate) => setRowValue(dayjs(newDate))}/>
                    </td>
                    <td style={{width: "10%", textAlign: "center"}}>
                        <IconButton onClick={handleChangeDone}>
                            <DoneIcon />
                        </IconButton>
                    </td>
                </>
                : <>
                    <td style={{width: "45%"}}>{props.value.format("DD.MM.YYYY")}</td>
                    <td style={{width: "10%", textAlign: "center"}}>
                        <IconButton onClick={() => setEditMode(true)}>
                            <EditIcon />
                        </IconButton>
                    </td>
                </>
            }
        </tr>
    );
}

export default DateDataRow;