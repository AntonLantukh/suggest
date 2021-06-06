import {useCallback, RefObject, KeyboardEvent, MouseEvent, ChangeEvent, FocusEvent} from 'react';

import {KEYBOARD_KEYS} from 'client/constants/keycode';

import type {Location} from 'client/typings';
import {LocationRes} from 'client/api/getLocations';

import useDebounce from 'client/hooks/useDebounce';

import {focusOption} from './utils';

type OptionHandlersProps = {
    setValue: (v: string) => void;
    setListVisibility: (v: boolean) => void;

    inputEl: RefObject<HTMLInputElement>;
    listEl: RefObject<HTMLUListElement>;
    data: Location[];
};

type OptionHandlersRes = {
    onOptionKeyDown: (name: string, index: number, evt: KeyboardEvent<Element>) => void;
    onOptionClick: (name: string, evt: MouseEvent<Element>) => void;
};

export const useOptionHandlers = ({
    setValue,
    setListVisibility,
    inputEl,
    listEl,
    data,
}: OptionHandlersProps): OptionHandlersRes => {
    const onOptionClick = useCallback(
        name => {
            setValue(name);
            setListVisibility(false);
        },
        [setValue, setListVisibility],
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

            if (evt?.keyCode === KEYBOARD_KEYS.DOWN && data.length > Number(key) + 1) {
                focusOption(listEl, Number(key) + 1, key);
                inputEl.current?.setAttribute('aria-activedescendant', String(Number(key) + 1));
            }

            if (evt?.keyCode === KEYBOARD_KEYS.UP && key === 0) {
                inputEl.current?.focus();
            }

            if (evt?.keyCode === KEYBOARD_KEYS.UP && key - 1 >= 0) {
                focusOption(listEl, key - 1, key);
                inputEl.current?.setAttribute('aria-activedescendant', String(Number(key) - 1));
            }
        },
        [setListVisibility, setValue, data, listEl, inputEl],
    );

    return {onOptionClick, onOptionKeyDown};
};

type InputHandlersProps = {
    setValue: (v: string) => void;
    setResult: (v: LocationRes) => void;
    setListVisibility: (v: boolean) => void;
    setPending: (v: boolean) => void;
    setSearchTerm: (v: string) => void;
    getData: (args: any) => Promise<any>;

    isListVisible: boolean;
    searchTerm: string;
    listEl: RefObject<HTMLUListElement>;
    data: Location[];
};

type InputHandlersRes = {
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onInputFocus: (e: FocusEvent<HTMLInputElement>) => void;
    onInputBlur: (e: FocusEvent<HTMLInputElement>) => void;
    onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const useInputHandlers = ({
    getData,
    setResult,
    setPending,
    setListVisibility,
    setValue,
    setSearchTerm,
    isListVisible,
    data,
    searchTerm,
    listEl,
}: InputHandlersProps): InputHandlersRes => {
    const onInputFocus = useCallback(
        evt => {
            if (searchTerm && evt.relatedTarget?.localName === 'li') {
                return;
            } else if (searchTerm) {
                setListVisibility(false);
            }
        },
        [setListVisibility, searchTerm],
    );

    const onInputBlur = useCallback(
        evt => {
            if (evt?.relatedTarget?.localName !== 'li') {
                setListVisibility(false);
            }
        },
        [setListVisibility],
    );

    const debounceOnChange = useCallback(
        useDebounce((args: any) => {
            setPending(true);

            return getData(args).then(results => {
                setPending(false);
                setResult(results);

                if (results.data.length && !isListVisible) {
                    setListVisibility(true);
                    focusOption(listEl, 0);
                }
            });
        }, 500),
        [setPending, setResult, setListVisibility, isListVisible],
    );

    const onInputChange = useCallback(
        async evt => {
            const value = (evt.target.value as string | undefined) || '';
            setValue(value);
            setSearchTerm(value);

            if (value.length >= 2) {
                await debounceOnChange({searchTerm: value});
            }
        },
        [setValue, setSearchTerm, debounceOnChange],
    );

    const onInputKeyDown = useCallback(
        evt => {
            if (evt?.keyCode === KEYBOARD_KEYS.DOWN && data.length > 0) {
                setListVisibility(true);
                focusOption(listEl, 0);
            }

            if (evt?.keyCode === KEYBOARD_KEYS.ESC) {
                setListVisibility(false);
            }
        },
        [setListVisibility, data, listEl],
    );

    return {onInputBlur, onInputFocus, onInputKeyDown, onInputChange};
};
