import React, {Component} from 'react';
import {Button, Card, message, Modal, Table} from "antd";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/LinkButton";
import AddForm from "./AddForm";
import {reqDeleteUsers, reqUsers, reqAddorUpdateUsers} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import {ExclamationCircleOutlined} from "@ant-design/icons";


class User extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '用户名',
            dataIndex: 'username',
        }, {
            title: '邮箱',
            dataIndex: 'email',
        }, {
            title: '电话',
            dataIndex: 'phone',
        }, {
            title: '注册时间',
            dataIndex: 'create_time',
            render: formateDate
        }, {
            title: '所属角色',
            dataIndex: 'role_id',
            render: (role_id) => this.roleNames[role_id]
            // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
        }, {
            title: '操作',
            render: (user) =>
                (<span>
                    <LinkButton onClick={() => this.updateUser(user)}>修改</LinkButton>
                    <LinkButton onClick={() => this.delete(user)}>删除</LinkButton>
                </span>)
        },
        ]
    }

    state = {
        users: [],
        roles: [],
        isShow: false,
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            console.log('get', result)
            const {users, roles} = result.data
            this.initRoleName(roles)
            this.setState({users, roles})
        }
    }
    initRoleName = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }
    updateUser = (user) => {
        this.user = user;
        console.log('update', this.user)
        this.setState({isShow: true})
    }
    delete = (user) => {
        Modal.confirm(
            {
                title: '提示',
                icon: <ExclamationCircleOutlined/>,
                content: `是否确定删除用户${user.username}`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                    const result = await reqDeleteUsers(user._id)
                    if (result.status === 0) {
                        message.success('用户删除成功')
                        this.getUsers()
                    } else {
                        message.error('用户删除失败')
                    }
                },
            }
        )


    }
    showAdd = () => {
        this.user = null
        this.setState({isShow: true})
    }
    addOrUpdateUser = async () => {
        this.setState({isShow: false})
        const user = this.formRef.current.getFieldsValue()
        console.log('user', user)
        this.formRef.current.resetFields();
        if (this.user) {
            user._id = this.user._id
        }
        const result = await reqAddorUpdateUsers(user)
        if (result.status === 0) {
            message.success(`用户${this.user._id ? '修改' : '创建'}成功`)
            this.getUsers()
        } else {
            message.success(`用户${this.user._id ? '修改' : '创建'}失败`)
        }
    }
    handleCancel = () => {
        this.setState({isShow: false})
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, isShow, roles} = this.state
        console.log('render', users)
        console.log('render', this.user)
        const title = (<Button type='primary' onClick={this.showAdd}>创建用户</Button>)
        return (

            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}/>
                <Modal
                    title={this.user ? '修改用户' : '添加用户'}
                    visible={isShow}
                    destroyOnClose
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <AddForm roles={roles} user={this.user} getAddForm={formRef => this.formRef = formRef}/>
                </Modal>
            </Card>
        );
    }
}

export default User;