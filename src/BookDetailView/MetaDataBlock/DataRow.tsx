import React from 'react';
import useTheme from "@material-ui/core/styles/useTheme";

interface Props {
    title: string,
    value: string
}

function DataRow(props: Props): JSX.Element {
    const theme = useTheme();

    return (
        <tr>
            <td style={{color: theme.palette.text.secondary}}>{props.title}</td>
            <td>{props.value}</td>
        </tr>
    );
}

export default DataRow;