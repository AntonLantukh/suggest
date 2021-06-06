import React, {MouseEvent, KeyboardEvent, memo} from 'react';

import {PLACE} from 'client/constants/location';
import type {Location} from 'client/typings';

import {stringify} from '../../utils';

import css from './style.css';

type Props = {
    onOptionKeyDown: (name: string, index: number, evt: KeyboardEvent<Element>) => void;
    onOptionClick: (name: string, evt: MouseEvent<Element>) => void;
    location: Location;
    index: number;
};

export const OptionContent = memo(({location, onOptionClick, onOptionKeyDown, index}: Props) => {
    const {country, name, isPopular, region, iata, placeType} = location;

    return (
        <li
            id={String(index)}
            role="option"
            aria-selected="false"
            className={css.option}
            tabIndex={-1}
            onKeyDown={evt => onOptionKeyDown(stringify([name, region, country]), index, evt)}
            onClick={evt => onOptionClick(stringify([name, region, country]), evt)}
        >
            <span className={[css.option__type, css[`option__type-${placeType}`]].join(' ')}>{PLACE[placeType]}</span>
            <div className={css.option__container}>
                <span className="option__name">
                    {name}
                    {iata ? ` (${iata})` : ''}
                </span>
                <span className={css.option__place}>{stringify([region, country])}</span>
            </div>
            {isPopular && <span className={css.option__popular}>Popular</span>}
        </li>
    );
});

OptionContent.displayName = 'OptionContent';

export const OptionEmpty = memo(() => (
    <li role="option" aria-selected="false" className={css.optionEmpty}>
        No results found
    </li>
));

OptionEmpty.displayName = 'OptionEmpty';
