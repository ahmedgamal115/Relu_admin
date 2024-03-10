import React, { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { Alert, MenuItem, Select } from '@mui/material'
import { useMutation, useQuery } from '@apollo/client'
import { AddProduct } from '../gql/Mutation'
import { routeLinks } from '../constants/RoutesLink'
import { useLocation, useNavigate } from 'react-router-dom'
import { GetSizes } from '../gql/Query'

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [Size,setSize] =useState('')
  const [images,setImages] =useState(null)
  const [values,setValues] =useState(null)
  const [showAlert,setShowAlert] =useState(false)
  const [dataFail,setDataFail] =useState(false)
  const {loading,error,data} = useQuery(GetSizes)
  const [addProduct,{errorfun}] = useMutation(AddProduct,{
    onCompleted:()=>{
      navigate(routeLinks.ProductsLink,{ state: { msg: "Prouct Uploaded" }})
      window.location.reload();
      window.scrollTo(0,0)
    }
  })
  const handleChange = (event) => {
    setSize(event.target.value);
    setValues({...values,[event.target.name]: event.target.value})
  };
  const handleInputs = (e)=>{
    setValues({...values,[e.target.name]: parseFloat(e.target.value)})
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
  const handleSubmitData = (e)=>{
    e.preventDefault()
    if(values){
      if(!values.productSize || !values.image || !values.price){
        setDataFail(true)
        console.log("here error")
      }else{
        setDataFail(false)
        addProduct({variables: values})
      }
    }else{
      setDataFail(true)
    }
  }
  return (
    <form className='sm:p-3 max-sm:p-3' onSubmit={(e)=>{handleSubmitData(e)}}>
      {
        showAlert && <Alert severity="error">Must upload 2 image only</Alert>
      }
      {
        location.state && <Alert severity="success">{location.state.msg}</Alert>
      }
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Product photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
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
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Product details</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="block w-[40%] px-2 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e)=>handleInputs(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-3 max-w-[150px]">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Size</label>
              <Select
                name='productSize'
                value= {Size}
                className='w-full h-12'
                autoWidth
                onChange={handleChange}
              >
                {
                  loading && <p>Loading...</p>
                }
                {
                  error && <p>error {console.error(error)}</p>
                }
                {
                  data &&
                    data.sizesFeed.map((size)=>(
                      <MenuItem key={`${size.id}`} value={`${size.id}`}>w-{size.width} - h-{size.height}</MenuItem>
                    ))
                }
              </Select>
            </div>
            
          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-5">
      {
        dataFail ?
          <div className="rounded-lg flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
            <p>Must full all data</p>
          </div>
        : ''
      }
        <button
          type="submit"
          className="rounded-md w-[20%] bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default Products