import React from 'react';
import DataRow from "./DataRow";
import {render} from "@testing-library/react";

describe('DataRow', () => {
    it('should render title and value', () => {
        const title = "This is a title";
        const value = "This is a value";

        const {getByText} = render(
            <table>
                <tbody>
                    <DataRow title={title} value={value}/>
                </tbody>
            </table>
        );

        getByText(title);
        getByText(value);
    });
});