import React, {useState} from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import EditIcon from '@material-ui/icons/Edit';
import {Button} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

interface Props {
    title: string,
    value: string
}

function DataRow(props: Props): JSX.Element {
    const theme = useTheme();
    const [editMode, setEditMode] = useState(false);

    return (
        <tr className="data-row">
            <td style={{color: theme.palette.text.secondary}}>{props.title}</td>
            {editMode
                ? <>
                    <td>
                        <input style={{width: "6rem"}} placeholder={props.value}/>
                    </td>
                    <td>
                        <Button variant="outlined" onClick={() => setEditMode(false)}>
                            Ok
                        </Button>
                    </td>
                </>
                : <>
                    <td>{props.value}</td>
                    <td>
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