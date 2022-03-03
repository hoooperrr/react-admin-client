import React, {Component} from 'react';
import {Button, Card, message, Modal, Table} from "antd";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/LinkButton";
import AddForm from "./AddForm";
import {reqAddUser, reqDeleteUsers, reqUsers} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import {ExclamationCircleOutlined} from "@ant-design/icons";


class User extends Component {
    constructor(props) {
        super(props);
        this.colums = [{
            title: '用户名',
            dataIndex: 'name',
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
            render: (role_id) => this.roleName[role_id]
            // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
        }, {
            title: '操作',
            render: (user) =>
                (<span>
                    <LinkButton onClick={() => this.update(user)}>修改</LinkButton>
                    <LinkButton onClick={() => this.delete(user)}>删除</LinkButton>
                </span>)
        },
        ]
    }

    state = {
        users: [],
        roles: [],
        isShow: false
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.setState({users, roles})
            this.initRoleName(roles)
        }
    }
    initRoleName = (roles) => {
        this.roleName = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
    }
    update = () => {

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
    addOrUpdateUser =async () => {
        this.setState({isShow:false})
        const user = this.formRef.current.getFieldsValue()
        this.formRef.current.resetFields();
        const result = await reqAddUser(user)
        this.getUsers()
    }
    handleCancel = () => {
        this.setState({isShow: false})
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users, isShow,roles} = this.state
        const title = (<Button type='primary' onClick={() => this.setState({isShow: true})}>创建用户</Button>)
        return (

            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}/>
                <Modal
                    title={isShow ? '添加用户' : '删除用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <AddForm roles={roles} getAddForm={formRef => this.formRef = formRef}/>
                </Modal>
            </Card>
        );
    }
}

export default User;