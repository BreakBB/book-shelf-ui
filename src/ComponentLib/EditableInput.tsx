import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import './EditableInput.css';
import '../BookDetailView/DataRow/DataRow.css';

interface Props {
    text: string;
    header?: boolean;
    onChangeDone: (string) => void;
}

export const EditableInput = (props: Props): JSX.Element => {
    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState(props.text);

    const handleChangeDone = () => {
        if (text !== props.text) {
            props.onChangeDone(text);
        }
        setEditMode(false);
    };

    const headerClassName = props.header ? 'header' : '';
    return (
        <div className={headerClassName}>
            {editMode ? (
                <div className={'data-value'}>
                    <input value={text} onChange={(event) => setText(event.target.value)} />
                    <IconButton style={{ marginLeft: 'auto' }} onClick={handleChangeDone}>
                        <DoneIcon />
                    </IconButton>
                </div>
            ) : (
                <div className={'data-value'}>
                    <span>{text}</span>
                    <IconButton style={{ marginLeft: 'auto' }} onClick={() => setEditMode(true)}>
                        <EditIcon />
                    </IconButton>
                </div>
            )}
        </div>
    );
};
