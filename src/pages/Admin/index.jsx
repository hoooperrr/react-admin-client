import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import {Layout} from 'antd';
import LeftNav from "../../components/LeftNav";
import MyHeader from "../../components/Header";
import Home from "../Home";
import Category from "../Category";
import Product from "../Product";
import Role from "../Role";
import User from "../User";
import Bar from "../Charts/bar";
import Line from "../Charts/line";
import Pie from "../Charts/pie";
import NotFound from "../NotFound";

const {Header, Footer, Sider, Content} = Layout;

class Admin extends Component {
    render() {
        const user = memoryUtils.user;
        if (!user || !user._id) {
            // this.props.history.push()
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider style={{padding: 0, backgroundColor: 'white'}}>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header style={{height: 'fit-content', padding: 0, backgroundColor: 'whitesmoke'}}>
                        <MyHeader/>
                    </Header>
                    <Content style={{margin: '20px', backgroundColor: 'white'}}>
                        <Switch>
                            <Redirect exact from='/' to='/home'/>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>

                    <Footer style={{
                        textAlign: 'center',
                        color: '#ccccc',
                        backgroundColor: 'rgb(253,222,238)',
                        margin: '0 20px'
                    }}>
                        Made with ❤ by
                        H
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;