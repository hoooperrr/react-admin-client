import React, {Component} from 'react';
import {Button, Card, Table, Space, message, Modal} from 'antd';
import {
    PlusOutlined,
    ArrowRightOutlined
} from '@ant-design/icons'
import LinkButton from "../../components/LinkButton";
import {reqCategory, reqAddCategory, reqUpdateCategory} from "../../api";
import AddFormContent from "./add-form-content";
import UpdateFormContent from "./update-form-content";


class Category extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                // dataIndex: 'action',
                render: (category) => (
                    <Space size="middle">
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {category.parentId === '0' ? (
                            <LinkButton onClick={() => this.showSubCategory(category)}>查看子分类</LinkButton>) : null}
                    </Space>
                )
            },
        ];
        this.state = {
            loading: false,
            category: [],
            subCategory: [],
            parentId: '0',
            parentName: '',
            subCategoryName: '',
            isModalVisible: 0,
        }

    }


    //没传就用parentId
    getCategory = async (parentId) => {
        parentId = parentId ||this.state.parentId
        this.setState({loading: true})
        const result = await reqCategory(parentId)
        this.setState({loading: false})
        if (result.status === 0) {
            const category = result.data;
            console.log('result', category);
            if (parentId === '0') {
                this.setState({category});
            } else {
                this.setState({subCategory: category})
            }
        } else {
            message.error('获取分类列表失败');
        }
    }

    showCategory = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategory: [],
        })
    }
    showSubCategory = (category) => {
        const {_id, name} = category
        this.setState({
            parentId: _id,
            parentName: name,
        }, () => {
            // console.log('pID', this.state.parentId)
            this.getCategory()
            // console.log('subC', this.state.subCategory)
        })
        //是异步的！！！
    }
    //
    // static async getDerivedStateFromProps(props,state) {
    //
    //     return {category}
    // }
    addCategory = async () => {
        this.addForm.current.validateFields().then(async values=>{
            this.setState({isModalVisible: 0})
            const {selectCategory: parentId, inputCategoryName: categoryName} = values
            // const {selectCategory: parentId, inputCategoryName: categoryName} = this.addForm.current.getFieldsValue()
            // console.log('!!', a)
            const result = await reqAddCategory(categoryName, parentId)

            if (result.status === 0) {
                if(parentId === this.state.parentId) {
                    await this.getCategory()
                } else if(parentId==="0") {
                    this.getCategory("0")
                }
            }
            this.addForm.current.resetFields()
        }).catch(

        )

    }
    handleChange = () => {}
    updateCategory = async () => {
        this.updateForm.current.validateFields().then(async values=>{

                /*
              values:
                {
                  username: 'username',
                  password: 'password',
                }
              */
            //1.
            this.setState({isModalVisible: 0})
            // this.updateForm.current.resetFields()

            //2.
            const categoryId = this.category._id
            const categoryName = values.category
            // const categoryName = this.updateForm.current.getFieldValue('category')
            console.log(categoryId, categoryName)
            const result = await reqUpdateCategory(
                {categoryName, categoryId});
            if (result.status === 0) {
                //3.log
                console.log('0')
                await this.getCategory()
            }
            this.updateForm.current.resetFields()
            console.log('form1', this.updateForm)
            // this.updateForm.current.setFieldsValue({'category': this.state.subCategoryName})
        }).catch(errorInfo=>{
            /*
              errorInfo:
                {
                  values: {
                    username: 'username',
                    password: 'password',
                  },
                  errorFields: [
                    { name: ['password'], errors: ['Please input your Password!'] },
                  ],
                  outOfDate: false,
                }
              */

        })

    }
    showAdd = () => {
        const {parentName, parentId} = this.state;
        this.addForm.current.setFieldsValue({selectCategory: parentId})
        this.setState({isModalVisible: 1})
    }
    showUpdate = (category) => {
        this.category = category
        this.updateForm.current.setFieldsValue({category: category.name})
        this.setState({
            isModalVisible: 2
        })
        // this.updateForm.setFieldsValue({category: this.state.subCategoryName}
    }
    getAddForm = (addForm) => {
        this.addForm = addForm
    }
    getUpdateForm = (updateForm) => {
        this.updateForm = updateForm
    }

    handleCancel = () => {
        // this.category = null
        this.updateForm.current.resetFields()
        this.setState({isModalVisible: 0})
    }

    componentDidMount() {
        this.getCategory();
    }

    render() {
        const {category, loading, parentId, parentName, subCategory, isModalVisible} = this.state;
        const toUpdateCategory = this.category || {};
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{margin: '0 5px'}}/>
                {parentName}
            </span>
        );
        const extra = (
            <Button onClick={this.showAdd}>
                <PlusOutlined/>
                添加
            </Button>
        );

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        loading={loading}
                        rowKey='_id'
                        pagination={{defaultPageSize: 5, showQuickJumper: true}}
                        dataSource={parentId === '0' ? category : subCategory}
                        columns={this.columns}>
                    </Table>
                </Card>
                <Modal title="添加分类"
                       visible={isModalVisible === 1}
                       forceRender
                       destroyOnClose={true}
                       onOk={this.addCategory}
                       onCancel={this.handleCancel}
                >
                    <AddFormContent category={category} parentId={parentId}
                                    getAddForm={this.getAddForm}/>
                </Modal>
                <Modal title="更新分类"
                       visible={isModalVisible === 2}
                       forceRender
                       destroyOnClose
                       onOk={this.updateCategory}
                       onCancel={this.handleCancel}>
                    <UpdateFormContent subCategoryName={toUpdateCategory.name}
                                       handleChange={this.handleChange}
                                       getUpdateForm={this.getUpdateForm}/>
                </Modal>
            </div>
        );
    }
}

export default Category;