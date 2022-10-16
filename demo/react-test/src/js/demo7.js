/*
 * @Author: 吴同学 
 * @Date: 2022-03-18 11:12:07 
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-04-13 11:17:54
 */
import '../css/demo7.css'
import React,{Component} from 'react';


const data = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

// 整个示例应用的整体
class FilterableProductTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filterText: '',
            inStockOnly: false
        }
        
        this.handleStateChange = this.handleStateChange.bind(this)
    }

    handleStateChange(data) {
        if(data.type === 'checkbox') {
            this.setState({
                inStockOnly:data.checked
            })
        } else {
            this.setState({
                filterText:data.value
            })
        }
    }
    
    render() {
        return(
            <div className="filter-box">
                <SearchBar
                    data={this.state}
                    onStateChange={this.handleStateChange}
                ></SearchBar>
                <ProductTable
                    data={this.state}
                ></ProductTable>
            </div>
        )
    }
}

// 接受所有的用户输入
class SearchBar extends Component  {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onStateChange(e.target)
    }

    render() {
        const {filterText,inStockOnly} = this.props.data;
        return(
            <div className="search-box">
                <input name="searchValue" type="text" placeholder="请输入" value={filterText} onChange={this.handleChange} />
                <label>
                    <input
                    name="inStockOnly"
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={this.handleChange} />
                    仅看在售
                </label>
            </div>
        )
    }
}

// 展示数据内容并根据用户输入筛选结果
class ProductTable extends Component {
    constructor(props) {
        super(props)
        this.list = []
    }

    render() {
        const {filterText,inStockOnly} = this.props.data;
        if(inStockOnly) {
            this.list = data.filter(item => item.stocked === true)
        } else {
            this.list = data
        }

        console.log(filterText,inStockOnly);
        return(
            this.list.map((item,index) =>
                <div key={index}>
                    <ProductRow item={item}></ProductRow>
                </div>
            )
        )
    }
}

// 为每一个产品类别展示标题
function ProductCategoryRow(props) {
    return(
        <h4>{props.list}</h4>
    )
}

// 每一行展示一个产品
function ProductRow(props) {
    return(
        <ul>
            <li>
                <span className='good-name'>{props.item.name}</span>
                <span className='good-price'>{props.item.price}</span>
            </li>
        </ul>
    )
}

export default FilterableProductTable