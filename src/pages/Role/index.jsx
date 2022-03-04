import React, {Component} from 'react';
import {Button, Card, message, Modal, Table} from "antd";
import {PAGE_SIZE} from '../../utils/constants'
import {reqAddRole, reqRoles, reqUpdateRole} from "../../api";
import AddFormContent from "./AddFormContent";
import AuthTree from "./AuthTree";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";

class Role extends Component {
    state = {
        roles: [{
            name: '11',
            create_time: 12231546,
            auth_time: 212312,
            auth_name: '21',
            _id: '21'
        }],
        role: {},
        isAdd: false,
        isAuth: false,
    }

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '角色名称',
                dataIndex: "name",
            },
            {
                title: '创建时间',
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: "auth_time",
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: "auth_name",
            },
        ]
        this.treeRef = React.createRef()
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({roles})
        }
    }

    handleRow = (role) => {
        return ({
            onClick: (event) => {
                console.log('role', role)
                this.setState({role})
            }
        })
    }

    handleAdd = () => {
        this.setState({isAdd: true});
    }
    handleAuth = () => {
        // AuthTree.forceUpdate()
        this.setState({isAuth: true});
    }
    addRole = () => {
        this.formRef.current.validateFields().then(async values => {
            this.setState({isAdd: false});
            const {inputRoleName: roleName} = values;
            this.formRef.current.resetFields();
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                message.success('角色添加成功')
                this.setState(state => ({
                    roles: [...state.roles, result.data]
                }))
                // const roles = [...this.state.roles,]
                // roles.push(result.data)

                // this.getRoles()
            } else {
                message.error('角色添加失败')
            }
        })

    }
    handleRole = (formRef) => {
        this.formRef = formRef
    }

    setAuth = async () => {
        const {roles, role} = this.state
        this.setState({isAuth: false});
        role.menus = this.treeRef.current.getTree()
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        const result = await reqUpdateRole(role)

        if (result.status === 0) {
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.info('您的用户角色权限已更新，请重新登录')
            } else {
                message.success('角色权限修改成功')
                this.setState(state => {
                        // roles.find(r => r._id === role._id).menus = role.menus
                        return {
                            roles: [...state.roles]
                        }
                    }
                )
            }
        } else {
            message.error('角色权限修改失败')

        }
    }

    handleCancel = () => {
        this.setState({isAdd: false, isAuth: false});
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isAdd, isAuth} = this.state;
        const title = (
            <span>
                <Button type='primary' onClick={this.handleAdd}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={this.handleAuth}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({role})
                        }
                    }}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    onRow={this.handleRow}
                >
                </Table>
                <Modal title="添加角色"
                       visible={isAdd}
                       forceRender
                       destroyOnClose={true}
                       onOk={this.addRole}
                       onCancel={this.handleCancel}
                >
                    <AddFormContent getAddForm={this.handleRole}
                                    handleChange={this.handleRow}/>
                </Modal>
                <Modal title="设置角色权限"
                       visible={isAuth}
                       destroyOnClose={true}
                       onOk={this.setAuth}
                       onCancel={this.handleCancel}
                >
                    <AuthTree
                        ref={this.treeRef}
                        role={role}/>
                </Modal>
            </Card>
        );
    }
}

export default Role;