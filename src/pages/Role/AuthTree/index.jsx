import React, {PureComponent} from 'react';
import {Form, Input, Tree,} from "antd";
import PropTypes from "prop-types";
import menuConfig from "../../../config/menuConfig";

const {Item} = Form

class AuthTree extends PureComponent {

    static propTypes = {
        role: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        const {menus} = this.props.role;
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, menu) => {
            pre.push({
                title: menu.title,
                key: menu.key,
            })
            if (menu.children) {
                pre[pre.length - 1].children = this.getTreeNodes(menu.children);
            }
            return pre;
        }, []);

    }
    // getTreeNodes = (menuList) => {
    //     return menuList.reduce((pre, menu) => {
    //         pre.push(
    //             <Tree title={menu.title} key={menu.key}>
    //                 {menu.children ? this.getTreeNodes(menu.children) : null}
    //             </Tree>)
    //         return pre
    //     }, [])
    // }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        this.setState({
            checkedKeys: selectedKeys,
        })
    };

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        this.setState({
            checkedKeys
        })
    };
    getTree = () => {
        return this.state.checkedKeys
    }

    componentWillMount() {
        // this.props.getAddForm(this.formRef)
        this.treeNodes = this.getTreeNodes(menuConfig)
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    // }
    //若state的值在任何时候都取决于props，那么可以使用getDerivedStateFromProps
    static getDerivedStateFormProps(props, state) {
        console.log('der')
        return {checkedKeys: props.role.menus}
    }

    render() {
        const {role} = this.props


        return (
            <div>
                <Form preserve={false} initialValues={{inputRoleName: role.name}}>
                    <Item name='inputRoleName' label='角色名称'>
                        <Input placeholder='请输入角色名称' disabled/>
                    </Item>
                </Form>
                <Tree
                    checkable
                    defaultExpandAll
                    // defaultExpandedKeys={['0-0-0', '0-0-1']}
                    // defaultSelectedKeys={['0-0-0', '0-0-1']}
                    // defaultCheckedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={role.menus}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    treeData={this.treeNodes}
                />

            </div>
        );
    }
}


export default AuthTree;