import React, { useLayoutEffect, useRef, useState } from 'react'
import { DataGrid, GridActionsCellItem, GridRowModes, useGridApiContext } from '@mui/x-data-grid';
import { Alert, Box } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { GetSizes } from '../gql/Query';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { AddSizes, UpdateSizes } from '../gql/Mutation';
import { ArrowUpOnSquareIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Sizes = () => {
    const [rowModesModel, setRowModesModel] = useState({});
    const [values,setValues] = useState(null)
    const [showAlert , setAlert] = useState(false)
    const [ alertMsg , setAlertMsg] = useState("")
    const [updateSizes] = useMutation(UpdateSizes,{
        onError:({ graphQLErrors })=>{
            if(graphQLErrors[0].extensions.exception.code === 11000){
                setAlert(true)
                setAlertMsg("Same size is exists")
            }
        }
    })
    const handleEditClick = (params) => () => {
        setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
    };
    function WidthInput(props){
        const { id, field, hasFocus } = props;
        const apiRef = useGridApiContext();
        const ref = useRef();
        useLayoutEffect(() => {
          if (hasFocus) {
            ref.current.focus();
          }
        }, [hasFocus]);
        return(
        <div className="sm:col-span-2">
            <div className="mt-2 w-full">
            <input
                type="number"
                name="width"
                id="width"
                ref={ref}
                value={props.value}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e)=>{
                setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                apiRef.current.setEditCellValue({ id, field, value: parseFloat(e.target.value)});
                }}
            />
            </div>
        </div>
        )
    }
    function HeightInput(props){
        const { id, field, hasFocus } = props;
        const apiRef = useGridApiContext();
        const ref = useRef();
        useLayoutEffect(() => {
          if (hasFocus) {
            ref.current.focus();
          }
        }, [hasFocus]);
        return(
        <div className="sm:col-span-2">
            <div className="mt-2 w-full">
            <input
                type="number"
                name="height"
                id="height"
                ref={ref}
                value={props.value}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e)=>{
                setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                apiRef.current.setEditCellValue({ id, field, value: parseFloat(e.target.value)});
                }}
            />
            </div>
        </div>
        )
    }
    const handleSaveClick = (params) => () => {
        updateSizes({
          variables: {
            "updateSizeId": params.id,
            "width": values.width,
            "height": values.height
          }
        })
        setValues(null)
        setRowModesModel({
          ...rowModesModel,
          [params.id]: { mode: GridRowModes.View },
        });
    };
    const handleCancelClick = (params) => () => {
        setRowModesModel({
          ...rowModesModel,
          [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };
    const columns = [
        {
            field: 'width',
            type: "number",
            headerName: 'Width (cm)',
            align: 'left',
            headerAlign: 'left',
            width: 120,
            editable: true,
            renderEditCell: (params) => (
                <WidthInput
                {...params}
                />
            ),
        },
        {
            field: 'height',
            type: "number",
            headerName: 'Height (cm)',
            align: 'left',
            headerAlign: 'left',
            width: 120,
            editable: true,
            renderEditCell: (params) => (
                <HeightInput
                {...params}
                />
            ),
        },
        {
            field: 'action',
            headerName: 'Update',
            type: 'actions',
            sortable: false,
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {
            const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
                return [
                <GridActionsCellItem
                    key={params.id}
                    icon={<ArrowUpOnSquareIcon />}
                    label="Save"
                    className="w-10 h-10 text-purple-400"
                    onClick={handleSaveClick(params)}
                />,
                <GridActionsCellItem
                    key={params.id}
                    icon={<XCircleIcon />}
                    label="Cancel"
                    className="w-10 h-10 text-purple-400"
                    onClick={
                    handleCancelClick(params)
                    }
                    color="inherit"
                />,
                ];
            }
    
            return [
                <GridActionsCellItem
                key={params.id}
                icon={<PencilSquareIcon className="w-9 text-gray-500 "/>}
                label="Edit"
                className='w-9 h-9'
                
                onClick={handleEditClick(params)}
                />,
                // <GridActionsCellItem
                //   icon={<TrashIcon className="w-8 h-8 text-gray-500" />}
                //   label="Delete"
                //   className="w-9 h-9"
                //   // onClick={handleDeleteClick(id)}
                // />,
            ];
            },
        },
    ];
    
    const [addSizes] = useMutation(AddSizes,{
        refetchQueries:[{
            query: GetSizes
        }],
        onError:({ graphQLErrors })=>{
            if(graphQLErrors[0].extensions.exception.code === 11000){
                setAlert(true)
                setAlertMsg("Same size is exists")
            }
        }
    })
    const {loading,error,data}= useQuery(GetSizes)

    const handleSubmitData = (e)=>{
    e.preventDefault()
    if(values){
        if(!values.width || !values.height ){
            setAlert(true)
            setAlertMsg("Please full all data require")
        }else{
            addSizes({variables:values})
            setValues(null)
            setAlert(false)
        }
    }else{
        setAlert(true)
        setAlertMsg("Please full all data require")
    }
    }
    const getRowHeight = () => {
    return 100; 
    };


  return (
    <>
        <form className='sm:p-3 max-sm:p-3' onSubmit={(e)=>{handleSubmitData(e)}}>
            {
            showAlert && <Alert severity="error">{alertMsg}</Alert>
            }
            <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Width
                    </label>
                    <div className="mt-2">
                    <input
                        type="number"
                        name="width"
                        id="width"
                        className="block w-[50%] rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e)=>{
                        setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                        }}
                    />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Height
                    </label>
                    <div className="mt-2">
                    <input
                        type="number"
                        name="height"
                        id="height"
                        className="block w-[50%] px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e)=>{
                        setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                        }}
                    />
                    </div>
                </div>
                </div>
            </div>
            </div>

            
            
            <div className="mt-6 flex items-center justify-end">
            <button
                type="submit"
                className="rounded-md w-[20%] bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Save
            </button>
            </div>
        </form>
        {
            loading && <p>Loading...</p>
        }
        {
            error && <p>Error!</p>
        }
        {
            data && 
            <div className='w-full'>
            <Box className='lg:w-fit sm:w-full max-sm:w-full sm:p-4 max-sm:p-4' >
                <DataGrid
                rows={data.sizesFeed}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                initialState={{
                    pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                getRowHeight={getRowHeight}
                />
            </Box>
            </div>
        }
    </>
  )
}

export default Sizes