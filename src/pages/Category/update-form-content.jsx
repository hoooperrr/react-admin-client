import React, {Component} from 'react';
import {Form, Input} from "antd";
import PropTypes from 'prop-types'

class UpdateFormContent extends Component {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        subCategoryName: PropTypes.string.isRequired,
        getUpdateForm:PropTypes.func.isRequired,
    }

    formRef = React.createRef();
    //若state的值在任何时候都取决于props，那么可以使用getDerivedStateFromProps
    // static getDerivedStateFromProps(props, state) {
    //     console.log('getDerivedStateFromProps', props, state);
    //     props.getUpdateForm(this.formRef)
    //     return {subCategoryName: props.subCategoryName}
    // }
    UNSAFE_componentWillMount() {
        console.log(this.formRef)
        this.props.getUpdateForm(this.formRef)
    }
    componentDidMount() {
        this.forceUpdate()
    }

    render() {
        // const {subCategoryName} = this.state
        const {subCategoryName} = this.props
        return (
            <div>
                <Form initialValues={{category: subCategoryName}}
                      ref={this.formRef}
                      preserve={false}
                >
                    <Form.Item name="category"
                    rules={[{required:true,message:'必须输入分类名称'}]}>
                        <Input placeholder='请输入分类名称'/>
                    </Form.Item>
                </Form>
                {
                    // this.formRef.current.setFieldsValue({category: subCategoryName})
                }
            </div>
        );
    }
}

export default UpdateFormContent;