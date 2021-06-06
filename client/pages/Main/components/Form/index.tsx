import React, {ChangeEvent, FunctionComponent} from 'react';

import Suggest from '../Suggest';

import css from './style.css';

const Form: FunctionComponent = () => {
    const onSubmit = (evt: ChangeEvent<HTMLFormElement>) => evt.preventDefault();

    return (
        <div className={css.searchForm}>
            <form className={css.searchForm__container} onSubmit={onSubmit}>
                <h2 className={css.searchForm__heading}>Let’s find your ideal car</h2>
                <fieldset className={css.searchForm__location}>
                    <Suggest />
                </fieldset>
            </form>
        </div>
    );
};

export default Form;
