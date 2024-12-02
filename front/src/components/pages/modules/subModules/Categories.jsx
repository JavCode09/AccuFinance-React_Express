import React from 'react';

//css
import '../../../styles/views/Categories.css';

//components
import Search_bar from '../../../common/search_engines/Search_bar'; //buscador
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Modal_Categories from '../../modals/Categories/Modal_add'; //modal add


const Categories = ({titleModule}) => {
    return ( 
        <div className="Categorias-container">
            <div className="Categorias-title">
                <h2>{titleModule}</h2>
            </div>
           <div className="Categorias-option">

                <div className="Categorias-search">
                  <Search_bar /> 
                </div>
                <div className="Categorias-btns">
                    {/* componente */}
                    <Button_add ModalComponent = {Modal_Categories}/>
                </div>
           
           </div>
           <div className="Categorias-content">
                <table className='Categorias-tabla'>
                    <thead>
                        <tr>
                            <th>Titulo1</th>
                            <th>Titulo2</th>
                            <th>Titulo3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data1</td>
                            <td>Data2</td>
                            <td>Data3</td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>
     );
}
 
export default Categories;