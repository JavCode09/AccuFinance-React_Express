import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ButtonBack = ({
      page,
      category,
      buttonvariant,
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
            : '';

    return ( 
        <div className="btn_back">
            <Button
                className={`btn_back btn btn-${buttonColor}`}
                variant= {buttonvariant}
                size={size}
                title={title}
                onClick={handleClick}
            >
                {value}
            </Button>
        </div>
     );
}
 
export default ButtonBack;