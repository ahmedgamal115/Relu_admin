import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation, useQuery } from '@apollo/client';
import { AddPromoCode } from '../gql/Mutation'
import { GetPromoCode } from '../gql/Query'
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box } from '@mui/material';
import { DiPhonegap } from "react-icons/di";

const PromoCode = () => {
  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      width: 150,
      editable: false,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 120,
      editable: false,
      renderCell: (params) =>(
        params.row.discount ?
          <p>{params.row.discount} %</p>
        :
          <DiPhonegap className='w-14 h-14' />
      )
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      editable: false,
      renderCell: (params) =>(
        params.row.amount ?
          <p>{params.row.amount} EGP</p>
        :
          <DiPhonegap className='w-14 h-14' />
      )
    },
    {
      field: 'expire',
      headerName: 'Expire date',
      width: 200,
      editable: false,
      renderCell: (params)=>(
        <p>{new Date(params.value).getFullYear()} - {new Date(params.value).getMonth()+1} - {new Date(params.value).getDate()}</p>
      )
    },
    {
      field: 'expired',
      headerName: 'Expired',
      width: 160,
      renderCell: (params)=>(
        (params.value) ?
        <p className='p-2 rounded-xl bg-red-400'>Expired</p>
        :
        <p className='p-2 rounded-xl bg-green-400'>Not expired</p>
      )
    },
  ];
  const [values,setValues] = useState({"code":"","expire":null})
  const [showAlert , setAlert] = useState(false)
  const [ alertMsg , setAlertMsg] = useState("")
  const [ discountInp , setDiscountInp] = useState("")
  const [ amountInp , setAmountInp] = useState("")
  const [addPromoCode] = useMutation(AddPromoCode,{
    onError: ({graphQLErrors})=>{
      setAlert(true)
      setAlertMsg(graphQLErrors[0].message)
    },
    refetchQueries:[{
      query: GetPromoCode
    }]
  })
  const {loading,error,data}= useQuery(GetPromoCode)

  const handleSubmitData = (e)=>{
    e.preventDefault()
    if(values.code === "" || values.expire === null){
      setAlert(true)
      setAlertMsg("Please full all data require")
    }else if(!values.discount && !values.amount ){
      setAlert(true)
      setAlertMsg("Please full all data require")
    }else{
      console.log(values)
      addPromoCode({variables:values})
      setValues({"code":"","discount":"","amount":"","expire":null})
      setAlert(false)
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

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
              
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={values.code}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e)=>{
                      setValues({...values,[e.target.name]: e.target.value})
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Discount
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="discount"
                    value={discountInp}
                    id="Discount"
                    className="block lg:w-[100%] sm:w-[40%] px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e)=>{
                      setDiscountInp(e.target.value)
                      e.target.value !== '' ? 
                        setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                      :
                        setValues({...values,[e.target.name]: null})
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Amount
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="amount"
                    value={amountInp}
                    id="Amount"
                    className="block w-[40%] px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e)=>{
                      setAmountInp(e.target.value)
                      e.target.value !== '' ? 
                        setValues({...values,[e.target.name]: parseFloat(e.target.value)})
                        :
                        setValues({...values,[e.target.name]: null})
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  value={values.expire}
                  selected={values.expire}
                  onChange={(data)=>{
                    let reformateDate = new Date(data)
                    if(reformateDate < new Date()){
                      setAlert(true)
                      setAlertMsg("Please select valid date")
                    }else{
                      setAlert(false)
                      setValues({...values,"expire": `${reformateDate.getFullYear()}-${reformateDate.getMonth()+1}-${reformateDate.getDate()}`})
                    }
                  }}
                  />
                </LocalizationProvider>
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
          <Box className='lg:w-[60%] sm:w-full max-sm:w-full sm:p-4 max-sm:p-4' >
            <DataGrid
              rows={data.promocodes}
              columns={columns}
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

export default PromoCode