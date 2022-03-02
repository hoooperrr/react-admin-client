import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import './index.less'
import {reqWeather} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import menuList from "../../config/menuConfig";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../LinkButton";


class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        city: '',
        weather: '',
        temperature: '',
        title: ''
    }

    getTime = () => {
        this.timer = setInterval(() => {
            this.setState({currentTime: formateDate(Date.now())})
        }, 1000);
    }

    getWeather = async () => {
        const result = await reqWeather(1);
        const {city, weather, temperature} = result;
        this.setState({city, weather, temperature})
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        // console.log('path', path)
        const title = this.findPath(menuList, path);
        // console.log('title' + title)
        return title
        // 得到当前请求路径
        // const path = this.props.location.pathname
        // let title
        // menuList.forEach(item => {
        //     if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        //         title = item.title
        //     } else if (item.children) {
        //         // 在所有子item中查找匹配的
        //         const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        //         // 如果有值才说明有匹配的
        //         if(cItem) {
        //             // 取出它的title
        //             title = cItem.title
        //         }
        //     }
        // })
        // return title
    }

    findPath = (menuList, path) => {
        for (let i = 0; i < menuList.length; i++) {
            if (path.indexOf(menuList[i].key) === 0) {
                return menuList[i].title;
            } else if (menuList[i].children) {
                if (this.findPath(menuList[i].children, path))
                    return this.findPath(menuList[i].children, path);
            }
        }
    }

    logOut = () => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined/>,
            content: '是否确定退出登录',
            okText: '确认',
            cancelText: '取消',
            onOk :() =>{
                storageUtils.removeUser()
                memoryUtils.user={}
                this.props.history.replace('/login')
            },
        })
    }

    componentDidMount() {
        this.getTime();
        this.getWeather();
        // this.getTitle();
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const {currentTime, city, weather, temperature} = this.state;
        // console.log('get', city, weather, temperature)
        const title = this.getTitle();
        return (
            <div className='my-header'>
                <div className='header-top'>
                    <span>欢迎，{memoryUtils.user.username}</span>

                    <LinkButton onClick={this.logOut}>退出
                            {/*<Modal*/}
                            {/*    title="Title"*/}
                            {/*    visible={visible}*/}
                            {/*    onOk={handleOk}*/}
                            {/*    confirmLoading={confirmLoading}*/}
                            {/*    onCancel={handleCancel}*/}
                            {/*>*/}
                            {/*    <p>{modalText}</p>*/}
                            {/*</Modal>*/}
                    </LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        {/*<img src=''/>*/}
                        <span>{city}</span>
                        <span>{weather}</span>
                        <span>{temperature}℃</span>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(Header);