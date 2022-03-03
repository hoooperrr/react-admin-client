import React, {PureComponent} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";

const {Item} = Form
const {Option} = Select

class AddForm extends PureComponent {
    formRef = React.createRef()
    static propTypes = {
        roles: PropTypes.array.isRequired,
        // parentId: PropTypes.string.isRequired,
        getAddForm: PropTypes.func.isRequired,
        // handleChange:PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.props.getAddForm(this.formRef)
    }

    render() {
        const {roles} = this.props
        const formLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 15, offset: 4},
        };

        return (
            <div>
                <Form {...formLayout} preserve={false} ref={this.formRef}
                      initialValues={{username: ''}}>
                    <Item name='username' label='用户名' rules={[{required: true, message: '请输入用户名'}]}>
                        <Input placeholder='请输入用户名'/>
                    </Item>
                    <Item name='password' label='密码' rules={[{required: true, message: '请输入密码'}]}>
                        <Input type='password' placeholder='请输入密码'/>
                    </Item>
                    <Item name='phone' label='手机号' rules={[{required: true, message: '请输入手机号'}]}>
                        <Input placeholder='请输入手机号'/>
                    </Item>
                    <Item name='email' label='邮箱' rules={[{required: true, message: '请输入邮箱'}]}>
                        <Input placeholder='请输入邮箱'/>
                    </Item>
                    <Item name='role_id' label='角色' rules={[{required: true, message: '请选择角色名'}]}>
                        <Select placeholder='请选择角色名'>
                            {
                                roles.map(role =>
                                    (<Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Option>))
                            }
                        </Select>
                    </Item>
                </Form>
            </div>
        );
    }
}

export default AddForm;