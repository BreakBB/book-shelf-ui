import React from 'react';

interface Props {
    label: string;
    name: string;
    required?: boolean;
}

const FormInput = (props: Props): JSX.Element => {
    const id = props.name;
    const required = props.required !== undefined ? props.required : true;

    return (
        <>
            <label htmlFor={id}>{props.label}</label>
            <input id={id} name={id} required={required}/>
        </>
    );
}

export default FormInput;