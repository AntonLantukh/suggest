import React, {ChangeEvent} from 'react';

import Suggest from '../Suggest';

import css from './style.css';

const Form = () => {
    const onSubmit = (evt: ChangeEvent<HTMLFormElement>) => evt.preventDefault();

    return (
        <form className={css.searchForm} onSubmit={onSubmit}>
            <h2 className={css.searchForm__heading}>Let’s find your ideal car</h2>
            <fieldset className={css.searchForm__location}>
                <Suggest />
            </fieldset>
        </form>
    );
};

export default Form;
