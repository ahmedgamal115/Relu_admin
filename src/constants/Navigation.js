import { routeLinks } from './RoutesLink'

const Navigation = [
    { name: 'Orders', link: routeLinks.OrdersLink, current: false },
    { name: 'Promo code', link: routeLinks.PromoCodeLink, current: false },
    { name: 'Sizes', link: routeLinks.SizesLink, current: false },
    { name: 'Product', link: routeLinks.ProductsLink, current: false },
    { name: 'Update Product', link: routeLinks.updateProductsLink, current: false },
]

export {Navigation}