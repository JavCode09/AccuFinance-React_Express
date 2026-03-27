import React, { Fragment } from 'react';
// css animation
import style from '../../Login.module.css'

const Seccion_login = () => {
    return ( 
        <Fragment>
            <section>
                <div className={`${style.wave} ${style.wave1}`}></div>
                {/* <div className={`${style.wave} ${style.wave2}`}></div> */}
                <div className={`${style.wave} ${style.wave3}`}></div>
                <div className={`${style.wave} ${style.wave4}`}></div>
            </section>
        </Fragment>
     );
}
 
export default Seccion_login;