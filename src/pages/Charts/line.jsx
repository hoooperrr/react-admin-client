import React, {Component} from 'react';
import ReactECharts from 'echarts-for-react';
import {Button, Card} from "antd";

class Line extends Component {
    state = {
        sales: [121, 121, 561, 899, 545, 242, 410],
        stores: [123, 200, 566, 966, 600, 300, 423],
    }
    getOption = (sales, stores) => {
        return {
            title: {
                text: '商品对比'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'line',
                    data: sales,
                }, {
                    name: '库存',
                    type: 'line',
                    data: stores,
                }
            ]
        }
    }
    updateData = () => {
        this.setState(state => ({
            sales: state.sales.map(i => (state.stores - 10) > 0 ? i + 10 : i),
            stores: state.stores.reduce((pre, i) => {
                if (i - 10 > 0) pre.push(i - 10);
                return pre
            }, []),
        }))
    }

    render() {
        const title = '折线图一'
        const {sales, stores} = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.updateData}>更新</Button>
                </Card>
                <Card title={title}>
                    <ReactECharts option={this.getOption(sales, stores)}
                                  notMerge={true}
                                  lazyUpdate={true}
                                  theme={"theme_name"}
                        // onChartReady={this.onChartReadyCallback}
                        // onEvents={EventsDict}
                        // opts={}
                    />
                </Card>
            </div>
        );
    }
}

export default Line;