import React from 'react';
import {Button, Modal, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useForm} from "react-hook-form";
import './NewBookModal.css'
import FormInput from "./FormInput";
import useTheme from "@material-ui/core/styles/useTheme";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (event) => void;
}

const NewBookModal = (props: Props): JSX.Element => {
    const {register, handleSubmit} = useForm();
    const theme = useTheme();

    return (
        <Modal open={props.show} onClose={props.onClose}>
            <Paper className="form-container">
                <Typography className="title-small" variant="h6">Add a new book</Typography>
                <form className="form-block" onSubmit={handleSubmit(props.onSubmit)}>
                    <FormInput label="Book name" id="title" register={register}/>
                    <FormInput label="ISBN" id="isbn" register={register}/>
                    <FormInput label="Author" id="author" register={register}/>
                    <FormInput label="Release Date" id="releaseDate" register={register}/>

                    <Button
                        type="submit"
                        style={{
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText
                        }}>
                        Create
                    </Button>
                </form>
            </Paper>
        </Modal>
    );
}

export default NewBookModal;