import React, {useState} from "react"
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

interface Props {
    text: string,
    onChangeDone: (string) => void
}

export const EditableHeader = (props: Props): JSX.Element => {
    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState(props.text);

    const handleChangeDone = () => {
        if (text !== props.text) {
            props.onChangeDone(text);
        }
        setEditMode(false);
    }

    return <div style={{marginBottom: "1.5rem"}}>
        {editMode
            ?
            <div className="header">
                <input value={text} onChange={(event) => setText(event.target.value)}/>
                <IconButton style={{float: "right"}} onClick={handleChangeDone}>
                    <DoneIcon/>
                </IconButton>
            </div>
            :
            <div className="header">
                <span>{props.text}</span>
                <IconButton style={{float: "right"}} onClick={() => setEditMode(true)}>
                    <EditIcon/>
                </IconButton>
            </div>
        }
    </div>
}