import React, { useRef } from 'react';
// import styles from './styles.css';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const StyledDiv = styled('div')`
    #wrap {
        position: relative;
        background: red;
        bottom: 16px;
    }

    #search {
        height: 40px;
        font-size: 16px;
        display: inline-block;
        border: none;
        outline: none;
        padding: 3px;
        padding-right: 50px;
        width: 0px;
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        z-index: 3;
        transition: width 0.5s cubic-bezier(0, 0.795, 0, 1);
        cursor: pointer;
    }

    #search:focus:hover {
        border-bottom: 1px solid #bbb;
    }

    #search:focus {
        width: 300px;
        z-index: 1;
        border-bottom: 1px solid #bbb;
        cursor: text;
    }

    #search_icon {
        height: 30px;
        width: 30px;
        display: inline-block;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFU1NT9fX1lJSUXl5e1dXVfn5+c3Nz6urqv7+/tLS0iYmJqampn5+fysrK39/faWlp////Vi4ZywAAABF0Uk5T/////////////////////wAlrZliAAABLklEQVR42rSWWRbDIAhFHeOUtN3/ags1zaA4cHrKZ8JFRHwoXkwTvwGP1Qo0bYObAPwiLmbNAHBWFBZlD9j0JxflDViIObNHG/Do8PRHTJk0TezAhv7qloK0JJEBh+F8+U/hopIELOWfiZUCDOZD1RADOQKA75oq4cvVkcT+OdHnqqpQCITWAjnWVgGQUWz12lJuGwGoaWgBKzRVBcCypgUkOAoWgBX/L0CmxN40u6xwcIJ1cOzWYDffp3axsQOyvdkXiH9FKRFwPRHYZUaXMgPLeiW7QhbDRciyLXJaKheCuLbiVoqx1DVRyH26yb0hsuoOFEPsoz+BVE0MRlZNjGZcRQyHYkmMp2hBTIzdkzCTc/pLqOnBrk7/yZdAOq/q5NPBH1f7x7fGP4C3AAMAQrhzX9zhcGsAAAAASUVORK5CYII=)
            center center no-repeat;
        background-size: 30px 30px;
        text-indent: -10000px;
        border: none;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        cursor: pointer;
        opacity: 0.8;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    #search_icon:hover {
        opacity: 1;
    }

    #search:focus #search_icon {
        opacity: 1;
    }
`;

const SearchBox = () => {
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!searchRef.current?.value) return;
        navigate(`/search?q=${searchRef.current?.value}`);
    };

    return (
        <StyledDiv>
            <div id="wrap">
                <form action="" autoComplete="off" onSubmit={onSearchSubmit}>
                    <input
                        id="search"
                        name="q"
                        type="text"
                        placeholder="Search campgrounds..."
                        ref={searchRef}
                    />
                    <input id="search_icon" type="submit" />
                </form>
            </div>
        </StyledDiv>
    );
};

export default SearchBox;
