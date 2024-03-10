import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'

import {GetOrders} from '../gql/Query'
import {DeleteOrder,DeliveredOrder} from '../gql/Mutation'
import { useMutation, useQuery } from '@apollo/client';
import { TrashIcon, TruckIcon } from '@heroicons/react/24/solid';
import { GiEmptyChessboard } from "react-icons/gi";
import LazyLoad from 'react-lazyload';




const Orders = () => {
  const CustomNoRowsOverlay = ()=>{
    return(
      <Box className="w-full h-full flex flex-col justify-center items-center font-bold text-2xl font-palanquin"> No Orders </Box>
    )
  }
  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      editable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 200,
      editable: false,
    },
    {
      field: 'otherPhone',
      headerName: 'Anther phone',
      width: 200,
      editable: false,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 300,
      editable: false,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      editable: false,
      renderCell: (params) =>
      <ul className='p-5 text-sm flex flex-col gap-2'>
        {params.value.map((product,idx)=>(
            <li  key={idx}>{product}</li>
        ))}
      </ul>
    },
    {
      field: 'customHeight',
      headerName: 'Custom Hight',
      width: 250,
      editable: false,
      renderCell: (params)=>(
        (params.value) ?
          <p>{params.value}</p>
        :
        <div className='flex justify-center items-center gap-3'>
          <GiEmptyChessboard className='w-10 h-10 '/>
          <p>No data</p>
        </div>
      )
    },
    {
      field: 'customWidth',
      headerName: 'Custom Width',
      width: 250,
      editable: false,
      renderCell: (params)=>(
        (params.value) ?
          <p>{params.value}</p>
        :
        <div className='flex justify-center items-center gap-3'>
          <GiEmptyChessboard className='w-10 h-10 '/>
          <p>No data</p>
        </div>
      )
    },
    {
      field: 'customeImage',
      headerName: 'Custom Image',
      width: 200,
      editable: false,
      renderCell: (params)=>(
        (params.value) ?
          <a href={params.value} target='_blank'>
            <img 
            src={params.value} 
            alt="custom order"
            className='object-contain w-[200px] h-[200px] cursor-pointer'
            />
          </a>
        :
        <div className='flex justify-center items-center gap-3'>
          <GiEmptyChessboard className='w-10 h-10 '/>
          <p>No data</p>
        </div>
      )
    },
    {
      field: 'productOrder',
      headerName: 'Order Image',
      width: 200,
      renderCell: (params) =>
      (params.value.length !== 0) ? 
      <div className='w-full flex flex-col justify-center items-center'>
        {params.value[0].image.map((imge,idx)=>(
            <LazyLoad key={idx} height={150} once>
              <img 
              src={`${imge}`} 
              alt="order"
              className='object-contain w-[150px] h-[100px]' />
            </LazyLoad>
        ))}
      </div>
      : 
      <div className='flex justify-center items-center gap-3'>
        <GiEmptyChessboard className='w-10 h-10 '/>
        <p>No data</p>
      </div>
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 200,
      renderCell: (params) =>
      (params.row.productOrder.length !== 0) ?
        <p className={`${(params.row.discountCode) ? 'line-through' : 'no-underline'} `}>{params.row.productOrder[0].price} EGP</p>
      :
        <div className='flex justify-center items-center gap-3 text-wrap text-center'>
            <p>Price will be customized</p>
        </div>
    },
    {
      field: 'discountCode',
      headerName: 'Promo code',
      width: 160,
      renderCell: (params)=>(
        (params.value) ?
          <p>{params.value.code}</p>
        :
        <div className='flex justify-center items-center gap-3'>
          <GiEmptyChessboard className='w-10 h-10 '/>
          <p>No data</p>
        </div>
      )
    },
    {
      field: 'discountValue',
      headerName: 'discount Value',
      width: 160,
      renderCell: (params)=>(
        (params.row.discountCode) ?
          <p>{params.row.discountCode.discount} %</p>
        :
        <div className='flex justify-center items-center gap-3'>
          <GiEmptyChessboard className='w-10 h-10 '/>
          <p>No data</p>
        </div>
      )
    },
    {
      field: 'priceDiscount',
      headerName: 'Price after discount',
      width: 200,
      renderCell: (params)=>(
        (params.row.discountCode) ?
          <p>{ params.row.productOrder[0].price - (params.row.productOrder[0].price * (params.row.discountCode.discount/100)) } EGP</p>
          :
          (params.row.productOrder.length !== 0) ?
            <p>{params.row.productOrder[0].price} EGP</p>
          :
            <div className='flex justify-center items-center gap-3 text-wrap text-center'>
                <p>Price will be customized</p>
            </div>
      )
    },
    {
      field: 'state',
      headerName: 'State',
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (params)=>(
        (params.row.productOrder.length !== 0) ?
          "Stander"
        :
          "custom"
      ),
      renderCell: (params)=>(
        (params.row.productOrder.length !== 0) ?
          <>
            <p className='font-palanquin font-bold' >Stander</p>
          </>
        :
          <>
            <p className='font-palanquin font-bold' >Custom</p>
          </>
      ),
    },
    {
      field: 'delivered',
      headerName: 'Delivered',
      width: 160,
      renderCell: (params)=>(
        params.value ?
          <p className='p-2 bg-green-400 rounded-xl'>Delivered</p>
        :
          <p className='p-2 bg-red-400 rounded-xl'>Not Delivered</p>
      )
    },
    {
      field: 'action',
      headerName: 'Delete',
      sortable: false,
      width: 100,
      renderCell: (params)=>(
        <>
          <TrashIcon className='w-10 cursor-pointer text-red-400'
          onClick={()=>{
            handleDeleteOrder(params.row.id)
          }}/>
        </>
  
      )
    },
    {
      field: 'actions',
      headerName: 'Delivery',
      sortable: false,
      width: 100,
      renderCell: (params)=>(
        <>
          <TruckIcon className='w-10 cursor-pointer  text-green-400'
          onClick={()=>{
            handleDeliveredOrder(params.row.id)
          }}/>
        </>
  
      )
    },
  ];
  const { loading, error, data } = useQuery(GetOrders,{
    pollInterval: 500
  })
  const [deleteOrder] = useMutation(DeleteOrder,{
    refetchQueries: [{query:GetOrders}]
  })
  const [deliveredOrder] = useMutation(DeliveredOrder,{
    refetchQueries: [{query:GetOrders}]
  })
  const getRowHeight = () => {
    return 200; 
  };
  
  const handleDeleteOrder = (id)=>{
      deleteOrder({variables:{deleteOrderId:id}})
  }
  const handleDeliveredOrder = (id)=>{
    deliveredOrder({variables:{deliverOrderId:id}})
  }

  if(loading) return <p>Loading...</p>
  if(error) return <p>Error! {console.log(error)}</p>

  return (
    <div className='w-full'>
      <Box sx={{ height: 600, width: '100%', "& .MuiDataGrid-row:hover": {
        backgroundColor: "rgb(203 217 237)" 
      }}}>
        <DataGrid
          rows={data.OrdersFeed}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          getRowClassName={(params)=>{
            if(params.row.productOrder.length === 0){
              return 'bg-gray-200'
            }
          }}
          
        />
      </Box>
    </div>
  )
}

export default Orders