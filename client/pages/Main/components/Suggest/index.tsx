import React, {
    useCallback,
    useState,
    useRef,
    ChangeEvent,
    MouseEvent,
    FocusEvent,
    KeyboardEvent,
    MutableRefObject,
} from 'react';

import getLocations, {LocationRes} from 'client/api/getLocations';
import {KEYBOARD_KEYS} from 'client/constants/keycode';

import {OptionContent, OptionEmpty} from '../Option';

import css from './style.css';

const Pendable = ({isPending}: {isPending: boolean}) =>
    isPending ? (
        <img
            alt=""
            className={css.suggest__pending}
            src="https://cdn2.rcstatic.com/images/site_graphics/newsite/preloader64.gif"
        />
    ) : null;

const Announcement = ({numFound}: {numFound: number | null}) => (
    <div id="announce" className={css.visuallyHidden} aria-live="assertive">
        {numFound !== null
            ? `${numFound} suggestions found, to navigate use up and down arrows`
            : 'Start typings to find a location'}
    </div>
);

const Label = () => (
    <label className={css.suggest__label} id="suggest-label" htmlFor="suggest">
        Pick-up Location
    </label>
);

type ListProps = {
    onOptionKeyDown: (name: string, index: number, evt: KeyboardEvent<Element>) => void;
    onOptionClick: (name: string, evt: MouseEvent<Element>) => void;
    listEl: MutableRefObject<HTMLUListElement | null>;
    result: LocationRes;
    isListVisible: boolean;
};

const List = ({listEl, result, isListVisible, onOptionClick, onOptionKeyDown}: ListProps) => {
    const {numFound, data} = result;
    return (
        <ul
            ref={listEl}
            tabIndex={-1}
            id="suggest-results"
            className={[css.hidden, css.suggest__results, !isListVisible && css.suggest__results_hidden]
                .filter(Boolean)
                .join(' ')}
            role="listbox"
            aria-labelledby="suggest-label"
        >
            {numFound ? (
                data.map((location, i) => (
                    <OptionContent key={i} {...{index: i, location, onOptionClick, onOptionKeyDown}} />
                ))
            ) : (
                <OptionEmpty />
            )}
        </ul>
    );
};

type InputProps = {
    value: string;
    inputEl: MutableRefObject<HTMLInputElement | null>;
    inInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onInputFocus: (e: FocusEvent<HTMLInputElement>) => void;
    onInputBlur: (e: FocusEvent<HTMLInputElement>) => void;
    onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = ({value, inputEl, inInputChange, onInputFocus, onInputBlur, onInputKeyDown}: InputProps) => (
    <input
        className={css.suggest__input}
        ref={inputEl}
        type="text"
        id="suggest"
        name="suggest"
        value={value}
        placeholder="city, airport, station, region, district…"
        aria-required="true"
        aria-autocomplete="both"
        aria-haspopup="true"
        aria-owns="sugges-results"
        aria-describedby="suggest-label"
        autoComplete="off"
        onInput={inInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onKeyDown={onInputKeyDown}
    />
);

const getNode = (ref: MutableRefObject<HTMLUListElement | null>, index: number): HTMLLIElement =>
    ref.current?.children?.[index] as HTMLLIElement;

const focusOption = (ref: MutableRefObject<HTMLUListElement | null>, index: number, prevIndex?: number) => {
    const liEl = getNode(ref, index);

    if (prevIndex != null) {
        const prevLiEl = getNode(ref, prevIndex);
        prevLiEl.setAttribute('aria-selected', 'false');
    }

    liEl.focus();
    liEl.setAttribute('aria-selected', 'true');
};

const Suggest = () => {
    const listEl = useRef<HTMLUListElement>(null);
    const inputEl = useRef<HTMLInputElement>(null);
    const suggestEl = useRef<HTMLInputElement>(null);

    const [isPending, setPending] = useState(false);
    const [isListVisible, setListVisibility] = useState(false);
    const [value, setValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<LocationRes>({data: [], numFound: null});

    const onOptionClick = useCallback(
        name => {
            setValue(name);
            setListVisibility(false);
        },
        [setValue],
    );

    const onInputFocus = useCallback(
        evt => {
            if (searchTerm && evt.relatedTarget?.localName === 'li') {
                return;
            } else if (searchTerm) {
                setListVisibility(false);
            }
        },
        [setListVisibility, focusOption, setValue, searchTerm, listEl],
    );

    const onInputBlur = useCallback(
        evt => {
            if (evt?.relatedTarget?.localName !== 'li') {
                setListVisibility(false);
            }
        },
        [setListVisibility],
    );

    const inInputChange = useCallback(
        async evt => {
            const value = (evt.target.value as string | undefined) || '';
            setValue(value);
            setSearchTerm(value);

            if (value.length >= 2) {
                setPending(true);
                const results = await getLocations({searchTerm: value});
                setPending(false);
                setResult(results);

                if (results.data.length && !isListVisible) {
                    setListVisibility(true);
                    focusOption(listEl, 0);
                }
            }
        },
        [setValue, setSearchTerm, setPending, setResult, setListVisibility, isListVisible, listEl],
    );

    const onInputKeyDown = useCallback(
        evt => {
            if (evt?.keyCode === KEYBOARD_KEYS.DOWN && result.data.length > 0) {
                setListVisibility(true);
                focusOption(listEl, 0);
            }

            if (evt?.keyCode === KEYBOARD_KEYS.ESC) {
                setListVisibility(false);
            }
        },
        [setListVisibility, result, listEl],
    );

    const onOptionKeyDown = useCallback(
        (name, key, evt) => {
            if (evt?.keyCode === KEYBOARD_KEYS.RETURN) {
                setValue(name);
                setListVisibility(false);
                inputEl.current?.focus();
            }

            if (evt?.keyCode === KEYBOARD_KEYS.ESC) {
                setListVisibility(false);
                inputEl.current?.focus();
            }

            if (evt?.keyCode === KEYBOARD_KEYS.DOWN && result.data.length > Number(key) + 1) {
                focusOption(listEl, Number(key) + 1, key);
                // inputEl.current?.setAttribute('aria-activedescendant', String(key + 1));
            }

            if (evt?.keyCode === KEYBOARD_KEYS.UP && key === 0) {
                inputEl.current?.focus();
            }

            if (evt?.keyCode === KEYBOARD_KEYS.UP && key - 1 >= 0) {
                focusOption(listEl, key - 1, key);
                // inputEl.current?.setAttribute('aria-activedescendant', String(key - 1));
            }
        },
        [setListVisibility, setValue, result, listEl],
    );

    const onOutSideClick = useCallback(
        evt => {
            if (!suggestEl?.current?.contains(evt.target)) {
                setListVisibility(false);
            }
        },
        [setListVisibility, suggestEl],
    );

    return (
        <div className={css.suggest} ref={suggestEl} onClickCapture={onOutSideClick}>
            <Label />
            <Pendable {...{isPending}} />
            <Input {...{inputEl, value, onInputFocus, onInputKeyDown, onInputBlur, inInputChange}} />
            <List {...{listEl, isListVisible, result, onOptionClick, onOptionKeyDown}} />
            <Announcement {...{numFound: result.numFound}} />
        </div>
    );
};

export default Suggest;
