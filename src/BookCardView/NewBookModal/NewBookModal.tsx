import React, {useState} from 'react';
import {Button, Modal, Paper} from "@material-ui/core";
import './NewBookModal.css'
import FormInput from "./FormInput";
import useTheme from "@material-ui/core/styles/useTheme";
import {NewBookRequest} from "../../types/types";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (book: NewBookRequest) => void;
}

const NewBookModal = (props: Props): JSX.Element => {
    const theme = useTheme();
    const [releaseDate, setReleaseDate] = useState(new Date());

    const handleSubmit = (event) => {
        event.preventDefault();

        const {title, isbn, author, releaseDate} = event.target.elements;
        props.onSubmit({
            title: title.value,
            isbn: isbn.value,
            author: author.value,
            releaseDate: dayjs(releaseDate.value).format("YYYY-MM-DD")
        })
    }

    return (
        <Modal open={props.show} onClose={props.onClose}>
            <Paper className="form-container">
                <h3 className="title-small">Add a new book</h3>
                <form className="form-block" onSubmit={handleSubmit}>
                    <FormInput label="Book name" name="title"/>
                    <FormInput label="ISBN" name="isbn"/>
                    <FormInput label="Author" name="author"/>
                    <label htmlFor="releaseDate">Release Date</label>
                    <DatePicker id="releaseDate" selected={releaseDate} onChange={setReleaseDate}/>

                    <div style={{width: "100%"}}>

                    <Button
                        type="submit"
                        style={{
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText
                        }}>
                        Create
                    </Button>
                    </div>
                </form>
            </Paper>
        </Modal>
    );
}

export default NewBookModal;