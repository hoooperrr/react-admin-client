import React, {Component} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";

const {Item} = Form

class AddFormConent extends Component {
    formRef = React.createRef()
    static propTypes = {
        getAddForm: PropTypes.func.isRequired,
        handleChange: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.props.getAddForm(this.formRef)
    }

    render() {
        return (
            <div>
                <Form preserve={false} ref={this.formRef}>
                    <Item name='inputRoleName' label='角色名称' rules={[{required: true, message: '请输入角色名'}]}>
                        <Input placeholder='请输入角色名称'/>
                    </Item>
                </Form>
            </div>
        );
    }
}

export default AddFormConent;