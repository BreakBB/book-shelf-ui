import React, {useState} from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import './DataRow.css';
import dayjs from 'dayjs';
import {DEFAULT_DATE_FORMAT} from '../../utils';

interface Props {
    title: string;
    value: string;
    onChangeDone: (string) => void;
}

const DateDataRow = (props: Props): JSX.Element => {
    const theme = useTheme();
    const [editMode, setEditMode] = useState(false);
    const [rowValue, setRowValue] = useState(props.value);

    const handleChangeDone = () => {
        if (props.value !== rowValue) {
            props.onChangeDone(rowValue);
        }
        setEditMode(false);
    };

    return (
        <tr className="data-row">
            <td className="data-key" style={{color: theme.palette.text.secondary}}>
                {props.title}
            </td>
            {editMode ? (
                <>
                    <td className="data-value">
                        <input
                            type="date"
                            name="Release Date"
                            onChange={(e) => setRowValue(dayjs(e.target.value).format(DEFAULT_DATE_FORMAT))}
                            required
                        />
                        <IconButton style={{marginLeft: 'auto'}} onClick={handleChangeDone}>
                            <DoneIcon />
                        </IconButton>
                    </td>
                </>
            ) : (
                <>
                    <td className="data-value">
                        <span>{dayjs(props.value).format(DEFAULT_DATE_FORMAT)}</span>
                        <IconButton style={{marginLeft: 'auto'}} onClick={() => setEditMode(true)}>
                            <EditIcon />
                        </IconButton>
                    </td>
                </>
            )}
        </tr>
    );
};

export default DateDataRow;
