import React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import './DataRow.css';
import { EditableInput } from '../../ComponentLib/EditableInput';

interface Props {
    title: string;
    value: string;
    onChangeDone: (string) => void;
}

function DataRow(props: Props): JSX.Element {
    const theme = useTheme();

    return (
        <tr className="data-row">
            <td className="data-key" style={{ color: theme.palette.text.secondary }}>
                {props.title}
            </td>
            <td colSpan={2}>
                <EditableInput text={props.value} onChangeDone={props.onChangeDone} />
            </td>
        </tr>
    );
}

export default DataRow;
