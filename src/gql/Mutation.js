import { gql } from "@apollo/client";

const DeleteOrder = gql`
mutation AddProduct($deleteOrderId: ID!) {
    deleteOrder(id: $deleteOrderId)
}
`
const DeliveredOrder = gql`
mutation AddProduct($deliverOrderId: ID!) {
    deliverOrder(id: $deliverOrderId)
}
`
const AddPromoCode = gql`
mutation Mutation($code: String!, $expire: String!, $discount: Float, $amount: Float) {
  addPromoCode(code: $code, expire: $expire, discount: $discount, amount: $amount) {
    id
    code
    discount
    amount
    expire
    expired
  }
}
`
const AddProduct = gql`
mutation Mutation($image: [Upload!]!, $productSize: ID!, $price: Float!) {
  addProduct(image: $image, productSize: $productSize, price: $price) {
    id
    image
    price
    productSize {
      id
      height
      width
    }
  }
}
`
const UpdateProduct = gql`
mutation Mutation($updateProductId: ID!, $oldImage: [String!]!, $image: [Upload!], $productSize: ID, $price: Float) {
  updateProduct(id: $updateProductId, oldImage: $oldImage, image: $image, productSize: $productSize, price: $price) {
    id
    image
    price
    productSize {
      id
      height
      width
    }
  }
}
`
const AddSizes = gql`
mutation Mutation($height: Float!, $width: Float!) {
  addSizes(height: $height, width: $width) {
    id
    height
    width
  }
}
`
const UpdateSizes = gql`
mutation Mutation($updateSizeId: ID!, $height: Float, $width: Float) {
  updateSize(id: $updateSizeId, height: $height, width: $width) {
    id
    height
    width
  }
}
`

export { DeleteOrder,DeliveredOrder,AddPromoCode
        ,AddProduct,UpdateProduct,AddSizes
        ,UpdateSizes }