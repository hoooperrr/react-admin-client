import React, {Component} from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import ProductDetail from "./Detail";
import ProductAddUpdate from "./AddUpdate";
import ProductHome from "./Home";
import './index.less'

class Product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/product/addUpdate' component={ProductAddUpdate}/>
                    <Route path='/product/detail' component={ProductDetail}/>
                    <Route exact path='/product' component={ProductHome}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        );
    }
}

export default Product;