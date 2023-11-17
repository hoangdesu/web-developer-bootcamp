import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const inputBgColor = '#fff';
const inputTextColor = '#222325';
const animationBounce = 'cubic-bezier(0.4, -1, 0.6, 2)';

const SearchBoxContainer = styled.div`
    @keyframes blink {
        49% {
            opacity: 0;
        }
        50% {
            oppacity: 1;
        }
        51% {
            oppacity: 1;
        }
        52% {
            opacity: 0;
        }
    }

    // Search Box
    .search-box {
        position: relative;

        &__input {
            width: 100%;
            background-color: ${inputBgColor};
            caret-color: ${inputBgColor};
            color: ${inputTextColor};
            border: 0;
            border-radius: 0.4em;
            padding: 0.2em 1.2em;
            /* padding: 1em; */
            font-size: 1em;
            box-shadow: 0 0 0.75em 0.25em rgba(${{ inputBgColor }}, 0.2);
            transition: box-shadow 0.5s ease;

            // Adds shadow to input
            &:hover,
            &:focus {
                outline: 0;
                box-shadow: 0 0.5em 1.5em 0.25em rgba(${inputBgColor}, 0.2);
            }

            // Display Search Icon
            + i {
                position: absolute;
                width: 0.125em;
                height: 70%;
                border-radius: 0.2em;
                background-color: ${inputTextColor};

                left: 1.2em;
                top: 50%;
                transform: rotateZ(-45deg) translateY(-50%);
                transform-origin: top;
                transition: transform 0.5s ${animationBounce};

                &::before {
                    content: '';
                    display: block;
                    position: relative;
                    top: 0em;
                    left: -0.3em;
                    width: 0.8em;
                    height: 0.8em;
                    border-radius: 100%;
                    border: 0.125em solid ${inputTextColor};
                    background-color: ${inputBgColor};

                    transition: transform 0.5s ${animationBounce};
                }
            }

            // Display custom caret
            &:focus {
                + i {
                    transform: rotateZ(0) translateY(-50%);
                    animation: blink 1.1s infinite 0.5s;

                    &::before {
                        transform: rotateY(90deg);
                    }
                }
            }

            // When value is not empty
            &[value]:not([value='']) {
                caret-color: ${inputTextColor};

                + i {
                    display: none;
                }
            }
        }
    }
`;
const SearchBoxAnimatedCarret = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!search) return;

        navigate(`/search?q=${search}`);
    };

    return (
        <SearchBoxContainer>
            <form onSubmit={onSearchSubmit}>
                <div className="search-box">
                    <input
                        className="search-box__input"
                        type="text"
                        value={search}
                        onInput={e => setSearch(e.currentTarget.value)}
                    />
                    <i />
                </div>
            </form>
        </SearchBoxContainer>
    );
};

export default SearchBoxAnimatedCarret;
