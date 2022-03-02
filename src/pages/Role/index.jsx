import React, {Component} from 'react';
import {
    Card,
    Button,
    Table
} from "antd";
import LinkButton from "../../components/LinkButton";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles} from "../../api";

class Role extends Component {
    state = {
        roles: [{
            name: '11',
            create_time: 12231546,
            auth_time: 212312,
            auth_name: '21',
            _id: '21'
        }]
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
            },
            {
                title: '授权时间',
                dataIndex: "auth_time",
            },
            {
                title: '授权人',
                dataIndex: "auth_name",
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            this.setState({roles})
        }
    }

    handleRow = (res) => {
        return ({
            onClick: () => {
            }
        })
    }

    render() {
        const {roles} = this.state;
        const title = (
            <span>
                <Button type='primary'>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{type: 'radio'}}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    onRow={this.handleRow}
                >
                </Table>
            </Card>
        );
    }
}

export default Role;