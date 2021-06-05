import React from 'react';

import {OptionContent, OptionEmpty} from '../Option';

import {MOCK_LOCATIONS} from './mock';

import css from './style.css';

const Suggest = () => (
    <div className={css.suggest}>
        <label className={css.suggest__label} id="suggest-label" htmlFor="suggest">
            Pick-up Location
        </label>
        <img
            alt=""
            className={css.suggest__pending}
            src="https://cdn2.rcstatic.com/images/site_graphics/newsite/preloader64.gif"
        />
        <input
            className={css.suggest__input}
            type="text"
            id="suggest"
            name="suggest"
            value=""
            placeholder="city, airport, station, region, district…"
            aria-required="true"
            aria-autocomplete="both"
            aria-haspopup="true"
            aria-owns="sugges-results"
            aria-activedescendant=""
        />
        <ul
            tabIndex={-1}
            id="suggest-results"
            className={css.suggest__results}
            role="listbox"
            aria-labelledby="suggest-label"
            // aria-activedescendant=""
        >
            {[MOCK_LOCATIONS].length ? (
                MOCK_LOCATIONS.map(location => <OptionContent {...location} />)
            ) : (
                <OptionEmpty />
            )}
        </ul>
        <div id="announce" className="visually-hidden" aria-live="assertive"></div>
    </div>
);

export default Suggest;
