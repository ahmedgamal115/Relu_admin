import { gql } from "@apollo/client";

const GetOrders = gql`
query Query {
    OrdersFeed {
      id
      username
      phone
      otherPhone
      address
      amount
      customHeight
      customWidth
      customeImage
      productOrder {
        id
        image
        price
        productSize {
          id
          height
          width
        }
      }
      discountCode {
        code
        discount
        expired
      }
      delivered
      customPrice
      comment
      createdAt
      updatedAt
    }
  }
`
const GetPromoCode = gql`
query Query {
    promocodes {
      id
      code
      discount
      expire
      expired
    }
}
`
const GetProducts = gql`
query productsFeed {
    productsFeed {
      id
      image
      price
      productSize {
        id
        width
        height
      }
    }
  }
`
const GetSizes = gql`
query SizesFeed {
    sizesFeed {
      id
      height
      width
    }
}
`

export {GetOrders,GetPromoCode,GetProducts,GetSizes}