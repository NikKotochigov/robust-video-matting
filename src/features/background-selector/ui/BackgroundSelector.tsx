// features/background-selector/ui/BackgroundSelector.tsx
import React from 'react';
import {BACKGROUND_OPTIONS} from '../../../shared/config/constants';
import {BackgroundOption} from '../model/types';
import styles from './BackgroundSelector.module.css';

interface BackgroundSelectorProps {
    value: BackgroundOption;
    onChange: (value: BackgroundOption) => void;
    className?: string;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
                                                                          value,
                                                                          onChange,
                                                                          className
                                                                      }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as BackgroundOption);
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <label htmlFor="background-select" className={styles.label}>
                Background Mode:
            </label>
            <select
                id="background-select"
                value={value}
                onChange={handleChange}
                className={styles.select}
            >
                {BACKGROUND_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};