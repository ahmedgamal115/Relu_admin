import { useMutation, useQuery } from '@apollo/client';
import { Alert, Box, MenuItem, Select } from '@mui/material';
import { ArrowUpOnSquareIcon, PencilSquareIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { DataGrid, GridActionsCellItem, GridRowModes, useGridApiContext } from '@mui/x-data-grid';
import React, { useLayoutEffect, useRef, useState } from 'react'
import { GetProducts, GetSizes } from '../gql/Query'
import LazyLoad from 'react-lazyload';
import { UpdateProduct } from '../gql/Mutation';
const UpdateProducts = () => {
    const { loading, error, data } = useQuery(GetProducts)
    const  sizeData  = useQuery(GetSizes)
    const [updateProduct,load] = useMutation(UpdateProduct,{
      onCompleted: ()=>{
        setValues(null)
        window.location.reload()
      }
    })
    const [rowModesModel, setRowModesModel] = useState({});
    const [showAlert,setShowAlert] =useState(false)
    const [images,setImages] =useState(null)
    const [values,setValues] =useState(null)
    const [size,setSize] =useState(null)
    
    function PriceInput(props){
      const { id, field, hasFocus } = props;
      const apiRef = useGridApiContext();
      const ref = useRef();
      useLayoutEffect(() => {
        if (hasFocus) {
          ref.current.focus();
        }
      }, [hasFocus]);
      return(
      <div className="sm:col-span-3">
        <div className="mt-2">
          <input
            type="number"
            name="price"
            ref={ref}
            id="price"
            value={props.value}
            className="block w-[100%] h-full border-none px-2 rounded-md py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
            onChange={(e)=>{
              setValues({...values,[e.target.name]:parseFloat(e.target.value)})
              apiRef.current.setEditCellValue({ id, field, value: parseFloat(e.target.value)});
            }}
          />
        </div>
      </div>
      )
    }
    function SelectionSizes() {
      return (
        <div className="sm:col-span-3 max-w-[150px] w-[200px]">
          <Select
            name='productSize'
            value= {size}
            className='w-full h-12'
            autoWidth
            onChange={(e)=>{
              setSize(e.target.value)
              setValues({...values,[e.target.name]:e.target.value})
            }}
          >
            {
              sizeData.data &&
                sizeData.data.sizesFeed.map((size)=>(
                  <MenuItem key={`${size.id}`} value={`${size.id}`}>w-{size.width} - h-{size.height}</MenuItem>
                ))
            }
          </Select>
        </div>
      );
    }
    const handleFiles = (e) =>{
      if(e.target.files.length > 2){
        return setShowAlert(true)
      }else{
        setShowAlert(false)
        let arr = []
        for (let index = 0; index < e.target.files.length; index++) {
          arr.push(e.target.files[index])
        }
        setImages(arr)
        setValues({...values,[e.target.name]: e.target.files})
      }
    }
    function ImageInput() {
      return (
        <div className="w-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {
                    showAlert && <Alert 
                    severity="error">
                      <p className='text-xs'>Must upload 2 image only</p></Alert>
                  }
                  <PhotoIcon className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span className='text-sm'>Upload a file</span>
                      <input id="file-upload" name="image" type="file" className="sr-only" multiple 
                      accept=".png, .jpg, .jpeg" onChange={handleFiles}/>
                    </label>
                    {
                      !images ?
                        <p className="pl-1">or drag and drop</p>
                      :
                        <p className="pl-1">Data uploaded</p>
                    }
                  </div>
                    {
                      !images ?
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      :
                        images.map((img,idx)=>(
                        <div key={idx} className='flex flex-wrap justify-center items-center'>
                          <p className="text-xs leading-5 text-gray-600">{img.name}</p>
                        </div>
                        ))
                    }
                </div>
              </div>
            </div>
      );
    }

    const handleEditClick = (params) => () => {
      // setImages(params.row.image)
      // setPrice(params.row.price)
      setValues({...values,"updateProductId":params.id,
      "oldImage": params.row.image})
      setSize(`w-${params.row.productSize.width} - h-${params.row.productSize.height}`)
      setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
    };
    const handleCancelClick = (params) => () => {
      setRowModesModel({
        ...rowModesModel,
        [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    };
    const handleSaveClick = (params) => () => {
      updateProduct({
        variables: values,
        refetchQueries:()=>[{
          query: GetProducts
        }],
      }).then(async()=>{
        setRowModesModel({
          ...rowModesModel,
          [params.id]: { mode: GridRowModes.View },
        });
      })
    };
    

    const columns = [
      {
        field: 'image',
        headerName: 'Images',
        width: 210,
        editable: true,
        renderCell: (params)=>(
          params.value.map((image,idx)=>(
              image ? 
              <LazyLoad height={150} once key={idx}>
                  <img 
                  src={`${image}`}
                  alt="Product"
                  className='object-cover w-[100px] h-[100px] rounded-lg pl-3' />
                </LazyLoad>
              : 
                <>
                  <p>Loading...</p>
                </>
          ))
        ),
        renderEditCell: ()=>(
          <ImageInput/>
        )
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 200,
        type: "number",
        align: 'left',
        headerAlign: 'left',
        editable: true,
        renderEditCell: (params) => (
          <PriceInput
          {...params}
          />
        ),
      },
      {
        field: 'productSize',
        headerName: 'Size',
        width: 200,
        editable: true,
        renderCell: (params)=>(
          <p>{params.value.width} X {params.value.height}</p>
        ),
        renderEditCell: params => (
          <SelectionSizes
          currentData={params.value}
          />
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
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
              icon={<PencilSquareIcon className="text-gray-500 "/>}
              label="Edit"
              className='w-9 h-9'
              
              onClick={handleEditClick(params)}
            />
          ];
        },
      },
    ];
    const getRowHeight = () => {
      return 150; 
    };
    const CustomNoRowsOverlay = ()=>{
      return(
        <Box className="w-full h-full flex flex-col justify-center items-center font-bold text-2xl font-palanquin"> No Products </Box>
      )
    }

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error! {console.log(error)}</p>
  return (
    <div className='relative w-full flex justify-center items-center'>
      {
        load.loading &&
          <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          w-[50%] h-[50%] bg-layout z-50 flex justify-center items-center'>
            <div
              className="inline-block h-14 w-14 animate-spin rounded-full 
              border-[10px] border-solid border-current border-e-transparent 
              align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] 
              dark:text-white"
              role="status">
            </div>
          </div>
      }
      <Box sx={{ height: 600 }} className='w-fit'>
        <DataGrid
          key={data.productsFeed.id}
          rows={data.productsFeed}
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
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          
          // onRowModesModelChange={handleRowModesModelChange}
          getRowHeight={getRowHeight}
        />
      </Box>
    </div>
  )
}

export default UpdateProducts