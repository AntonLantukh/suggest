import React from 'react';

import css from './style.css';

const Header = () => (
    <div className={css.header}>
        <div className={css.header__container}>
            <h1 className={css.header__title}>Car Hire – Search, Compare & Save</h1>
            <p className={css.header__subtitle}>
                Compare 900 companies at over 60,000 locations. Price Match Guarantee
            </p>
        </div>
    </div>
);

export default Header;
