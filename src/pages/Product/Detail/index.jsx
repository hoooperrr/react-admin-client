import React, {Component} from 'react';
import {
    Card,
    List, Space,
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import '../index.less'
import LinkButton from "../../../components/LinkButton";
import {BASE_IMG_URL} from "../../../utils/constants";
import {reqProductCategory} from "../../../api";

const {Item} = List;

class Detail extends Component {
    state = {
        cName1: '',
        cName2: '',
    }
    getCategory = async () => {
        const {pCategoryId, categoryId} = this.props.location.state.product
        if (pCategoryId === '0') {
            const result = await reqProductCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            const results = await Promise.all([reqProductCategory(pCategoryId), reqProductCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    componentDidMount() {
        this.getCategory()
    }

    render() {
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{color: 'blue', marginRight: 5, cursor: 'pointer'}}
                        onClick={() => this.props.history.goBack()}
                    />
                    </LinkButton>
                商品详情
            </span>
        )
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item className='product-Item'>
                        <span className='left'>商品名称：</span>
                        {name}
                    </Item>
                    <Item className='product-Item'>
                        <span className='left'>商品描述：</span>
                        {desc}
                    </Item>
                    <Item>
                        <Space align='start'>
                            <span className='left'>商品价格：</span>
                            {price}
                        </Space>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        {cName1}{cName2 ? '-->' + cName2 : null}
                    </Item>
                    <Item>
                        <Space align='start'>
                            <span className='left'>商品图片：</span>
                            {imgs ? imgs.map(img => {
                                if (img) return (
                                    <img key={img} src={BASE_IMG_URL + img} alt='商品图' className='product-img'/>)
                            }) : null}
                        </Space>

                    </Item>
                    <Item>
                        <Space align='start'>
                            <span className='left'>商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}/>
                        </Space>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default Detail;