import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import './index.less'
import {
    Form,
    Input,
    Button, message,
} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import {reqLogin} from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
// 路由 登录
const Item = Form.Item;

class Login extends Component {
    handleSubmit = event => {
        console.log('***', event)
    }
    onFinish = async (values) => {
        //阻止事件默认行为
        //高阶组件包裹本组件 event获得props传props.form得到的value
        //只有检验通过调用
        console.log('Received values of form: ', values);
        const {username, password} = values
        // try {
        const response = await reqLogin(username, password);
        console.log(response);
        //     .then(response => {
        //     console.log(response.data)
        // }).catch(error => {
        //     console.log(error)
        // });
        // } catch (error) {
        //     console.log(error.message);
        // }
        const result = response;
        if (result.status === 0) {
            message.success('登陆成功');
            const user = result.data;
            memoryUtils.user = user;
            storageUtils.saveUser(user);
            this.props.history.replace('/');
        } else {
            message.error(result.msg)
        }
    }

    validator = (rule, value) => {
        console.log('passwordvali', rule, value);
        if (value.length < 4 || value.length > 12 || /^[a-zA-Z0-9]$/.test(value)) {
            // return new Promise(resolve, reject)
            return Promise.reject(new Error('Should accept agreement'));
        }
        return Promise.resolve();
    }


    render() {
        const user = memoryUtils.user;
        if(user && user._id) {
            return <Redirect to='/'/>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={this.onFinish}
                        onSubmit={this.handleSubmit}
                    >
                        <Item
                            name="username"
                            rules={[
                                {required: true, whitespace: true, message: 'Please input your Username!'},
                                {type: "string", message: 'Please input a string!'},
                                {min: 4, max: 12, message: '请输入长度4-12的用户名!'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message: '字母数字下划线组成'},
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"
                                                         style={{color: "cadetblue"}}/>}
                                   placeholder="Username"/>
                        </Item>

                        <Item
                            name="password"
                            rules={[
                                {validator: this.validator},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"
                                                      style={{color: "cadetblue"}}/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Item>
                        {/*<Form.Item>*/}
                        {/*    <Form.Item name="remember" valuePropName="checked" noStyle>*/}
                        {/*        <Checkbox>Remember me</Checkbox>*/}
                        {/*    </Form.Item>*/}

                        {/*    <a className="login-form-forgot" href="">*/}
                        {/*        Forgot password*/}
                        {/*    </a>*/}
                        {/*</Form.Item>*/}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            {/*Or <a href="">register now!</a>*/}
                        </Form.Item>
                    </Form>
                </section>
            </div>

        );
    }
}

export default Login;