import React from 'react';

interface Props {
    label: string;
    name: string;
    required?: boolean;
    type?: string;
}

const FormInput = (props: Props = { label: '', name: '', required: true, type: 'text' }): JSX.Element => {
    const id = props.name;

    return (
        <>
            <label htmlFor={id}>{props.label}</label>
            <input id={id} type={props.type} name={id} required={props.required} />
        </>
    );
};

export default FormInput;
