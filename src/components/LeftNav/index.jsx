import React, {Component} from 'react';
import './index.less'
import logo from '../../assets/images/logo.png'
import {Link, withRouter} from 'react-router-dom'
import {Menu} from 'antd';
import {
    PieChartOutlined,
    DesktopOutlined,
    MailOutlined,
} from '@ant-design/icons';
import menuI from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";

const {SubMenu} = Menu;

class LeftNav extends Component {
    state = {
        collapsed: false,
        menuConfig: [],
    };

    componentWillMount() {
        this.menuNodes = this.getMenuList_reduce(menuI);
        // this.setState({})
        // this.forceUpdate()
    }

    hasAuth = (item) => {
        const {key, isPublic} = item
        const {menus} = memoryUtils.user.role
        const {username} = memoryUtils.user
        if (isPublic || menus.indexOf(key)!==-1||username==='admin') {
            return true;
        } else if(item.children){
            return !!item.children.find(c=>menus.indexOf(c.key)!==-1)
        }
        return false
    }

    getMenuList_map = (menuList) => {
        // const menuList= this.state.menuConfig;
        // const menuList = menuI || []; 会栈溢出
        console.log(menuList)
        return menuList.map(item => {
            // import('@ant-design/icons');
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={'<' + item.icon + '/>'}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={<MailOutlined/>} title={item.title}>
                        {this.getMenuList_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    getMenuList_reduce = (menuList) => {
        const path = this.props.location.pathname
        console.log('reduce' + menuList)
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push(<Menu.Item key={item.key} icon={''}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>);
                    return pre;
                } else {
                    const cItem = item.children.find(i => path.indexOf(i.key) === 0);
                    if (cItem) this.open = item.key;

                    pre.push(<SubMenu key={item.key} icon={<MailOutlined/>} title={item.title}>
                        {this.getMenuList_reduce(item.children)}
                    </SubMenu>);
                    return pre;
                }
            }
            return pre;

        }, []);
    }


    render() {
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    {/*<header>*/}
                    <img src={logo} alt="logo"/>
                    <h1>React后台管理</h1>
                    {/*</header>*/}
                </Link>
                <div>
                    <Menu mode='inline'
                          theme='light'
                          selectedKeys={[path]}
                          defaultOpenKeys={[this.open]}
                    >
                        {
                            this.menuNodes
                            // this.getMenuList_map(menuI)
                            // this.getMenuList_reduce(menuI)
                        }

                    </Menu>
                </div>


            </div>
        );
    }
}

export default withRouter(LeftNav);