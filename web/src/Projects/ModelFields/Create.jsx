import '../../App.css'
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert'
import Select from '../../Components/tailwindUI/Select';
import { createProjectFields } from '../../api/controller/FieldsController'
import { getDataTypes } from '../../api/controller/DataTypeController'
import { getProjectStructure } from '../../api/controller/ProjectsController'
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

function CreateProjectModel({modelId, onCreated}) {
    const session = JSON.parse(localStorage.getItem('session'));
    const location = useLocation();
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('Error');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(0);
    const [model_field_relation, setModelFieldRelation] = useState(0);
    const [selectedDataType, setSelectedDataType] = useState(null);

    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedField, setSelectedField] = useState(0);

    const [projectApps, setProjectApps] = useState([]);
    const [projectModels, setProjectModels] = useState([]);
    const [projectFields, setProjectFields] = useState([]);

    const [dataTypes, setDataTypes] = useState([]);

    const [showApps, setShowApps] = useState(false);
    const [showModels, setShowModels] = useState(false);
    const [showFields, setShowFields] = useState(false);



    useEffect(() => {

      if(projectApps.length == 0){
        projectStructure()
      }

      if(dataTypes.length == 0){
        getDataTypes(session.token).then(async (response) => {
          let res = await response.json();
          if (response.status === 200){
            setSelectedDataType(res[0].id)
            setDataTypes(res)
          }
        })
      }else{
        dataTypes.map((item) => {
          if(item.id == selectedDataType){
            if (item.name == 'OnetoOneForeignKey' || item.name == 'OnetoManyForeignKey' || item.name == 'ManytoManyForeignKey'){
              setShowApps(true)
            }else{
              setShowApps(false)
              setSelectedModel(null)
              setSelectedApp(null)
              setSelectedField(0)
              setShowModels(false)
              setShowFields(false)
            }
          }
        })
      }

      if(selectedApp){
        setShowModels(true)
        //setSelectedModel(projectApps[selectedApp].app_models[0].id)
        projectApps.map((item) => {
          if(item.id == selectedApp){
            setProjectModels(item.app_models)
          }
        })
      }

      if(selectedModel){
        setShowFields(true)
        //setSelectedModel(projectModels[0].id)
        projectModels.map((item) => {
          if(item.id == selectedModel){
            console.log(item)
            setProjectFields(item.model_fields)
          }
        })
      }

      if (selectedField){
        projectFields.map((item) => {
          if(item.id == selectedField){
            setModelFieldRelation(selectedField)
          }
        })
      }

    }, [selectedDataType, showApps, showModels, showFields, selectedApp, selectedModel, selectedField]);

    const onCloseHandler = () => {
        setError(null)
        setAlertType('Error');
        setAlertMessage('')
    }

    const buttonHandler = async () => {
      if(name === '' || description ==='' || order === 0 ){
          setAlertType('Warning');
          setAlertMessage('Ingresa los datos.')
          setError(true);
          return;
      }

      let data = {
        name: name,
        caption: description,
        order: parseInt(order),
        data_type: parseInt(selectedDataType),
        app_model: parseInt(modelId),
      }


      if(model_field_relation != 0){
        data.model_field_relation = model_field_relation
      }

      await createProjectFields(data, session.token).then(async (response) => {
        let res = await response.json();
        if (response.status === 201){
          setAlertType('Success');
          setAlertMessage('Campo creado correctamente.')
          setError(true);
          setTimeout((e) => onCreated && onCreated(true),1000);
          return;
        }else{
          const keys = Object.keys(res);
          setAlertMessage(res[keys[0]][0])
          setAlertType('Error');
          setError(true);
        }
      })
    }

    const projectStructure = async () => {
      await getProjectStructure(session.token, location.state.project.id).then(async (response) => {
        let res = await response.json();
        console.log("projectStructure",res)
        if (response.status === 200){
          setProjectApps(res)
        }
      })
    }

    return (
        <div className="w-full h-full bg-slate-100">
            <div className='flex flex-row h-full'>
                <div className='w-full'>
                    <div className='mt-3 ml-5 flex justify-center'>
                        <p className='text-3xl font-bold'>Crear campo</p>
                    </div>
                    <div className='flex flex-col justify-between'>
                    <div className='mt-5 p-5 flex flex-col items-center m-auto w-1/2 rounded-2xl bg-white'>

                        <div className="w-full overflow-hidden">
                            <Alert type={alertType} show={error != null} title={alertMessage} onClose={onCloseHandler} />
                        </div>

                        <div className='mt-5 w-full items-center flex flex-row'>
                          <div className='w-full flex flex-col items-center'>
                            <div className='w-full flex flex-col justify-between'>
                              <p className='font-bold'>Nombre:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setName(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Nombre' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <p className='font-bold'>Etiqueta en formularios:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setDescription(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Etiqueta' type="text" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <p className='font-bold'>Orden:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <input onChange={(event) => {setOrder(event.target.value)}} className='w-1/2 text-black py-2 px-4 rounded-full bg-white border border-zinc-600' placeholder='Orden' type="number" id="project_name" name="project_name"/><br/><br/>
                              </div>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <Select value={selectedDataType} setValue={setSelectedDataType} listOptions={dataTypes} label={"Tipo de dato"} needed={true}/>
                              </div>
                              {showApps ? <> <p className='font-bold'>App:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <Select value={selectedApp} setValue={setSelectedApp} listOptions={projectApps}/>
                              </div></>:null}
                              {showModels ? <> <p className='font-bold'>Modelo:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <Select value={selectedModel} setValue={setSelectedModel} listOptions={projectModels}/>
                              </div></>:null}
                              {showFields ? <> <p className='font-bold'>Campo:</p>
                              <div className='mb-10 w-full flex flex-row justify-center'>
                                <Select value={selectedField} setValue={setSelectedField} listOptions={projectFields}/>
                              </div></>:null}
                            </div>
                          </div>
                        </div>
                        <div className='w-1/4'>
                        <input onClick={buttonHandler} className=' text-white w-full py-2 px-4 rounded-full bg-zinc-400 mx-auto hover:bg-cyan-400 hover:cursor-pointer' type="submit" value="Crear"/><br/><br/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

CreateProjectModel.propTypes = {
  modelId : PropTypes.number,
  onCreated: PropTypes.func
}


export default CreateProjectModel
