import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ButtonAddPage = ({
    page,
    category,
    size,
    styleColor,
    title,
    value
}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(page);
    };

    const buttonColor =
        styleColor && styleColor.trim() !== ''
            ? styleColor
            : 'primary';

    return (
        <div className="btn_add_page">
            <Button
                className={`btn_add_page btn btn-${buttonColor}`}
                size={size}
                title={title}
                onClick={handleClick}
            >
                {value}
            </Button>
        </div>
    );
};

export default ButtonAddPage;