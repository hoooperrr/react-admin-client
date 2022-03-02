import React, {Component} from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from "prop-types";

const {Item} = Form
const {Option} = Select

class AddFormContent extends Component {
    formRef = React.createRef()
    static propTypes = {
        category: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        getAddForm:PropTypes.func.isRequired,
        handleChange:PropTypes.func.isRequired,
    }
    componentWillMount() {
        this.props.getAddForm(this.formRef)
    }

    render() {
        const {category, parentId,handleChange} = this.props
        return (
            <div>
                <Form preserve={false} ref={this.formRef}
                      initialValues={{selectCategory: parentId}}>
                    <Item name='selectCategory'>
                        <Select>
                            <Option value='0' key='0'>一级分类列表</Option>
                            {category.map(c =>
                                (<Option value={c._id} key={c._id}>{c.name}</Option>)
                            )}
                        </Select>
                    </Item>
                    <Item name='inputCategoryName' rules={[{required:true,message:'请输入分类名'}]}>
                        <Input placeholder='请输入分类名称'/>
                    </Item>
                </Form>
            </div>
        );
    }
}

export default AddFormContent;