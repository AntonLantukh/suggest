import React from 'react';

import type {Location} from '../../typings';

import {PLACE} from '../../constants';

import css from './style.css';

export const OptionContent = ({country, name, isPopular, region, iata, placeType}: Location) => (
    <li role="option" aria-selected="false" className={css.option} tabIndex={-1}>
        <span className={[css.option__type, css[`option__type-${placeType}`]].join(' ')}>{PLACE[placeType]}</span>
        <div className={css.option__container}>
            <span className="option__name">
                {name}
                {iata ? ` (${iata})` : ''}
            </span>
            <span className={css.option__place}>{[region, country].join(', ')}</span>
        </div>
        {isPopular && <span className={css.option__popular}>Popular</span>}
    </li>
);

export const OptionEmpty = () => (
    <li role="option" aria-selected="false" className="option-empty">
        No results found
    </li>
);
