import React, {useState} from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from "@material-ui/core/IconButton";
import "./DataRow.css"

interface Props {
    title: string,
    value: string,
    onChangeDone: (string) => void
}

function DataRow(props: Props): JSX.Element {
    const theme = useTheme();
    const [editMode, setEditMode] = useState(false);
    const [rowValue, setRowValue] = useState(props.value);

    const handleChangeDone = () => {
        if (rowValue !== props.value) {
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
                        <input value={rowValue} onChange={(event) => setRowValue(event.target.value)}/>
                    </td>
                    <td className="edit-button">
                        <IconButton onClick={handleChangeDone}>
                            <DoneIcon />
                        </IconButton>
                    </td>
                </>
                : <>
                    <td className="data-value"><span>{rowValue}</span></td>
                    <td className="edit-button">
                        <IconButton onClick={() => setEditMode(true)}>
                            <EditIcon />
                        </IconButton>
                    </td>
                </>
            }
        </tr>
    );
}

export default DataRow;