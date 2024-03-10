import Dashboard from "./Pages/Dashboard";
import Orders from "./Pages/Orders";
import Products from "./Pages/Products";
import PromoCode from "./Pages/PromoCode";
import { routeLinks } from './constants/RoutesLink'
import {  Route, BrowserRouter as Router , Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import UpdateProducts from "./Pages/UpdateProducts";
import Sizes from "./Pages/Sizes";

function App() {
  const uri = import.meta.env.VITE_SOME_KEY_API_URI
  const client = new ApolloClient({
    link: createUploadLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route  path="/" exact element={<Dashboard page={<Orders/>} pageName={"Orders"}/>} />
          <Route  path={routeLinks.OrdersLink} exact element={<Dashboard page={<Orders/>} pageName={"Orders"}/>} />
          <Route  path={routeLinks.PromoCodeLink} exact element={<Dashboard page={<PromoCode/>} pageName={"Promo code Creation"}/>} />
          <Route  path={routeLinks.SizesLink} exact element={<Dashboard page={<Sizes/>} pageName={"Add Sizes"}/>} />
          <Route  path={routeLinks.ProductsLink} exact element={<Dashboard page={<Products/>} pageName={"Product Creation"}/>} />
          <Route  path={routeLinks.updateProductsLink} exact element={<Dashboard page={<UpdateProducts/>} pageName={"Update Products"}/>} />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App
