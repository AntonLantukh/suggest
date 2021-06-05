import React from 'react';

import Suggest from '../Suggest';

import css from './style.css';

const Form = () => (
    <form className={css.searchForm}>
        <h2 className={css.searchForm__heading}>Let’s find your ideal car</h2>
        <fieldset className={css.searchForm__location}>
            <Suggest />
        </fieldset>
    </form>
);

export default Form;
