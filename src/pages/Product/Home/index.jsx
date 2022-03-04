import React, {Component} from 'react';
import {
    Card,
    Select,
    Input,
    Table,
    Button, message
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import LinkButton from "../../../components/LinkButton";
import {reqProducts, reqSearchProducts, reqUpdateProductStatus} from "../../../api";
import {PAGE_SIZE} from "../../../utils/constants";
import memoryUtils from "../../../utils/memoryUtils";

const {Option} = Select;
// {
//     "status": 0,
//     "data": {
//     "pageNum": 1,
//         "total": 0,
//         "pages": 0,
//         "pageSize": 2,
//         "list": []
// }
// }
class Home extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            }, {
                title: '商品描述',
                dataIndex: 'desc',
            }, {
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                    //指定了当前行的数据对象参数就是该数据，否则是整行对象
                    return <span>{`￥${price}`}</span>
                }
            }, {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    //指定了当前行的数据对象参数就是该数据，否则是整行对象
                    const {status, _id} = product
                    return (<span>
                        <Button
                            onClick={() => this.updateStatus(status === 1 ? 2 : 1, _id)}>
                            {status === 1 ? '下架' : '上架'}
                        </Button>
                        {status === 1 ? '在售' : '已下架'}
                    </span>)
                }
            }, {
                width: 100,
                title: '操作',
                render: (product) => {
                    //指定了当前行的数据对象参数就是该数据，否则是整行对象
                    return (<span>
                        <LinkButton
                            onClick={() => this.toDetail(product)}>
                            详情
                        </LinkButton>
                        <LinkButton
                            onClick={() => this.toUpdate(product)}>修改</LinkButton>
                    </span>)
                }
            }
        ]
    }

    state = {
        loading: false,
        total: 0,
        products: [{
            'name': '1',
            'desc': '11111111111',
            'price': '555',
            'status': 0,
            '_id': '0'
        }],
        searchContent: '',
        searchType: 'productName',
    }

    toDetail = (product) => {
        memoryUtils.product = product
        this.props.history.push('/product/detail')
    }
    toUpdate = (product) => {
        memoryUtils.product = product
        this.props.history.push('/product/addUpdate')
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        const {searchContent, searchType} = this.state
        this.setState({loading: true})
        let result
        if (searchContent) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchContent, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({loading: false})

        if (result.status === 0) {
            const {list, total} = result.data
            this.setState({total, products: list})
        }
    }
    updateStatus = async (status, productId) => {
        const result = await reqUpdateProductStatus(productId, status)
        if (result.status === 0) {
            message.success('商品状态更新成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.getProducts(1)
    }

    render() {
        const {loading, products, total, searchType, searchContent} = this.state
        const title = (
            <div>
                <Select defaultValue='productName'
                        value={searchType}
                    // ref={c => this.selectType = c}
                        style={{width: 150}}
                        onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    value={searchContent}
                    style={{width: 125, margin: '0 10px'}}
                    onChange={e => this.setState({searchContent: e.target.value})}
                />
                <Button type='primary' value='search' onClick={() => this.getProducts(1)}>搜索</Button>
            </div>
        );
        const extra = (
            <div>
                <Button type='primary' icon={<PlusOutlined/>}
                        onClick={() => this.props.history.push('/product/addUpdate')}>
                    添加商品
                </Button>
            </div>

        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={products}
                        columns={this.columns}
                        loading={loading}
                        pagination={{
                            current: this.pageNum,
                            total,
                            showQuickJumper: true,
                            defaultPageSize: PAGE_SIZE,
                            onChange: this.getProducts
                        }}
                    >
                    </Table>
                </Card>

            </div>

        );
    }
}

export default Home;