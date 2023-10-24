import '../../App.css'
import React from 'react';
import PropTypes from 'prop-types';

function ModalDelete({onDelete}) {
  
    return (
        <div className='w-full'>
            <div className='mt-3 ml-5 flex flex-row justify-center'>
                <p className='text-3xl font-bold'>Eliminar registro</p>
            </div>
                <div className='mt-5 p-5 flex flex-col items-center m-auto w-full rounded-2xl bg-white'>

                    <div className='mt-5 w-full items-center flex flex-row'>

                        <div className='w-full flex flex-row justify-center'>
                            <p className='font-bold'>¿Estás seguro que quieres eliminar el registro?</p>
                        </div>
                    </div>
                    <div className='mt-10 w-1/2'>
                        <input onClick={onDelete} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Eliminar"/><br/><br/>
                    </div>
                </div>
        </div>
    )
}

ModalDelete.propTypes = {
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

export default ModalDelete
