import React from 'react';

interface Props {
    label: string;
    id: string;
    register: (ref: HTMLInputElement | null) => void;
}

const FormInput = (props: Props): JSX.Element => {
    const id = props.id;
    return (
        <>
            <label htmlFor={id}>{props.label}</label>
            <input id={id} ref={props.register} name={id}/>
        </>
    );
}

export default FormInput;