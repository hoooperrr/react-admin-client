import React, {Component} from 'react';
import {
    Card,
    Cascader,
    Form,
    Input,
    Button, message,
} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import LinkButton from "../../../components/LinkButton";
import {reqCategory, reqProductAddOrUpdate} from "../../../api";
import PicturesWall from "./PicturesWall";
import RichTextEdit from "./RichTextEdit";

const {Item} = Form;
const {TextArea} = Input;
// const optionLists = [
//     {
//         value: 'zhejiang',
//         label: 'Zhejiang',
//         isLeaf: false,
//     },
//     {
//         value: 'jiangsu',
//         label: 'Jiangsu',
//         isLeaf: false,
//     },
// ];


class AddUpdate extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.pictureRef = React.createRef();
        this.detailRef = React.createRef();
    }

    state = {
        options: [],
    }

    initOptions = async (category) => {
        const options = category.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }));
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        if (isUpdate && pCategoryId !== '0') {//初始化二级分类列表
            const subCategory = await this.getCategory(pCategoryId)
            const targetOption = options.find(o => o.value === pCategoryId)
            targetOption.children = subCategory.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
        }

        this.setState({options})
    }

    validatePrice = (_, value) =>
        value * 1 > 0 ? Promise.resolve() : Promise.reject(new Error('请输入大于0的数值'))

    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];//0
        targetOption.loading = true;
        const subCategory = await this.getCategory(targetOption.value)
        targetOption.loading = false;
        if (subCategory && subCategory.length > 0) {
            targetOption.children =
                subCategory.map(c => ({
                    label: c.name,
                    value: c._id,
                    isLeaf: true,
                }))
        } else {
            targetOption.isLeaf = true;
        }

        // setTimeout(() => {
        //     targetOption.loading = false;
        //     targetOption.children =
        //         subCategory.map(c => ({
        //             label: c.name,
        //             value: c._id,
        //             isLeaf: true,
        //         }))
        //     [ //指定下一级列表
        //     {
        //         label: `${targetOption.label} Dynamic 1`,
        //         value: 'dynamic1',
        //         isLeaf: true,
        //     },
        //     {
        //         label: `${targetOption.label} Dynamic 2`,
        //         value: 'dynamic2',
        //         isLeaf: true,
        //     },
        // ];
        //     this.setState({options: [...this.state.options]});//要用数组解构
        // }, 1000);
        this.setState({options: [...this.state.options]});//要用数组解构

    }

    submit = async (values) => {
        /* 如果用onClick={this.submit}
        则 this.formRef.current.validateFields().then(values => { */
        console.log('finish1', values)
        const {name, desc, price, categoryIds} = values;
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0];
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pictureRef.current.getImages();
        const detail = this.detailRef.current.getDetail();
        const product = {
            name,
            desc,
            price,
            pCategoryId,
            categoryId,
            imgs,
            detail
        }
        if (this.isUpdate) {
            product._id = this.product._id
        }
        console.log(product)
        const result = await reqProductAddOrUpdate(product);
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)

        }
    }

    getCategory = async (parentId) => {
        const result = await reqCategory(parentId);
        if (result.status === 0) {
            const category = result.data;
            if (parentId === '0') {
                await this.initOptions(category)
            } else {
                return category;//返回promise对象
            }
        }
    }

    componentWillMount() {
        const product = this.props.location.state || null
        this.isUpdate = !!product;//强制转换为Boolean
        this.product = product || {}
        console.log(product)
        this.getCategory('0')

    }

    componentDidMount() {
    }

    render() {
        const {isUpdate, product} = this
        console.log(product)
        const {pCategoryId, categoryId, imgs, detail, name, price, desc} = product
        const categoryIds = []
        // console.log(product.product.name)
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(pCategoryId);
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId);
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => {
                    this.props.history.goBack()
                }}>
                    <ArrowLeftOutlined/>
                </LinkButton>
                {isUpdate ? '修改商品' : '添加商品'}
            </span>

        )
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 8},
        };
        const formTailLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8, offset: 4},
        };
        return (
            <Card title={title}>
                <Form ref={this.formRef}
                      initialValues={{
                          name: name,
                          desc,
                          price,
                          categoryIds,
                      }}
                      onFinish={this.submit}>
                    <Item
                        {...formItemLayout}
                        name='name'
                        label='商品名称'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称',
                            },
                        ]}><Input placeholder='请输入商品名称'/>
                    </Item>
                    <Item
                        {...formItemLayout}
                        name='desc'
                        label='商品描述'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品描述',
                            }]}>
                        <TextArea placeholder='请输入商品描述' autoSize={{minRows: 2, maxRows: 6}}/>
                    </Item>
                    <Item
                        {...formItemLayout}
                        name='price'
                        label='商品价格'
                        rules={[
                            {required: true, message: '请输入商品价格',},
                            {validator: this.validatePrice},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('price') * 1 > 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),]}

                    >

                        <Input placeholder='请输入商品价格' type='number' min={1} max={10000} addonAfter='元'/>
                    </Item>

                    <Item {...formItemLayout}
                          name='categoryIds'
                          label='商品分类'
                          rules={[{required: true, message: '请选择商品分类'}]}>
                        <Cascader options={this.state.options} loadData={this.loadData} onChange={this.onChange}
                                  changeOnSelect/>
                    </Item>
                    <Item
                        {...formItemLayout}
                        label='商品图片'>
                        <PicturesWall ref={this.pictureRef} imgs={imgs}/>
                    </Item>
                    <Item
                        labelCol={{span: 3}}
                        wrapperCol={{span: 21}}
                        label='商品详情'>
                        <RichTextEdit ref={this.detailRef} detail={detail}/>
                    </Item>
                    <Item {...formItemLayout}
                          label=''>
                        <Button type='primary' htmlType="submit">提交</Button>

                    </Item>
                </Form>

            </Card>
        );
    }
}

export default AddUpdate;