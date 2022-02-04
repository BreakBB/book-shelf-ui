import React from 'react';
import './DataRow.css';
import {EditableInput} from '../../../components/EditableInput/EditableInput';

interface Props {
    title: string;
    value: string;
    onChangeDone: (string) => void;
}

const DataRow = (props: Props): JSX.Element => {
    return (
        <tr className="data-row">
            <td className="data-key">{props.title}</td>
            <td colSpan={2}>
                <EditableInput text={props.value} onChangeDone={props.onChangeDone} />
            </td>
        </tr>
    );
};

export default DataRow;
