/**
 * Created by zhaopengsong on 2017/5/9.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    WebView,
    ListView,
    ActionSheetIOS,
    RefreshControl
} from 'react-native';
//导入外部组件

//复选框相关
import CheckBox from './ZPCheckBox';
const CheckBoxName = 'CheckBox';
var CheckBoxRefs = {};//存放item checkbox ref
var toDeleteIds = [];
var hasChange = false;
var datas = [];
//引入Dimensions
var Dimensions = require('Dimensions');
var {width, height}= Dimensions.get('window');
var ZPchexkbox = React.createClass({
    // //设置常量
    getDefaultProps(){
        return{
            url_api :"http://127.0.0.1:3000/api/resources?dest=/",
            // keyWord:'list'
        }
    },
    //初始化方法
    getInitialState(){
        return{
            //ListView头部的数据源
            headerDataArr:[],
            //cell的数据源
            dataSource: new ListView.DataSource({rowHasChanged:(r1,r2)=>{ return r1!==r2 || hasChange;}}),
        isRefreshing:false,
            isDeleteMode:false,
            isAllSelect:false,//是否全选
    }
    },
    render() {
        return (
            <View style={styles.container}>

        {/*导航*/}
        {this.renderNavBar()}
        {/*创建ListView*/}
    <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections={true}
        refreshControl={
            <RefreshControl
        refreshing={this.state.isRefreshing}
        onRefresh={this._onRefresh}
        tintColor="#cccccc"
        title="Loading..."
        titleColor="#cccccc"
            />
    }
    />
        {/*底部操作按钮*/}
        {this._renderOptView()}
    </View>

    );
    },
    pushToView(){
        this.props.navigator.push({
            component:UPloadFile,
            title:"测试",
            passProps:{

            }
        })
    },
    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navOutViewStyle}>
    <TouchableOpacity onPress={()=>{this.props.navigator.pop()}} style={styles.leftViewStyle}>
    <Image source={{uri: 'back'}} style={styles.navImageStyle}/>
    </TouchableOpacity>

        <Text style={{color:'black', fontSize:16, fontWeight:'bold'}}>服务器文件</Text>



    <TouchableOpacity onPress={()=>{alert('点了!')}} style={styles.NavrightViewStyle}>
    <Image source={{uri:'icon_shop_search'}} style={styles.navImageStyle}/>
    </TouchableOpacity>
        <TouchableHighlight
        style={styles.NavRightBtnOneStyle}
        underlayColor="#d9d9d9"
        onPress={() => {
            console.log('确定');
            this._selectAll();
        }}>
    <Text style={styles.CellRightSubexittext}>
        全选
        </Text>
        </TouchableHighlight>
        </View>
    )
    },
    //创建单独的cellView
    renderRow(rowData){
        return(
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.pushToNewsDetail(rowData)}} onLongPress={()=>{this._onItemLongPress()}}>
    <View style={styles.cellViewStyle}>
        {/*左边*/}
    <Image source={{uri:'640'}} style={styles.leftImageStyle}></Image>
        {/*右边*/}
        <View style={styles.CellrightViewStyle}>
    <View style={{marginTop:5,marginLeft:15,flexDirection:'row',}}>
    <Text style={styles.CellrightViewtitleStyle}>{rowData.name}</Text>
        {/*<Text style={styles.CellrightViewtitleStyle}>{}</Text>*/}
        </View>

        {this._renderCheckbox(rowData.id)}
    <View style={styles.CellRightSubViewStyle}>
    <Text style={{fontSize:12,color:'gray'}}>{rowData.createdate}</Text>
        <Text style={{fontSize:12,color:'gray'}}>{(rowData.length / 1024 ).toFixed(2) }KB</Text>
        </View>

        </View>

        </View>
        </TouchableOpacity>
    )
    },
    /*
     ********************* 复选框相关*****************************
     */

    /**
     * 底部操作按钮
     */
    _renderOptView(){
        if(this.state.isDeleteMode){
            return (
                <View style={{flexDirection:'row'}}>
        <TouchableOpacity
            style={{height:50,flex:1,backgroundColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}
            activeOpacity={0.8}
            onPress={this._onCancelPress}>
        <Text style={{color:'white',fontSize:16}}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{height:50,flex:1,backgroundColor:'#DAA520',alignItems:'center',justifyContent:'center'}}
            activeOpacity={0.8}
            onPress={this._onDeletePress}>
        <Text style={{color:'white',fontSize:16}}>确定</Text>
            </TouchableOpacity>
            </View>
        );
        }
        return null;
    },
    _renderCheckbox(key){//使用数据id作为key
        console.log('this.state.isDeleteMode',this.state.isDeleteMode,key);
        var checkbox = null;
        if(this.state.isDeleteMode){
            checkbox = (
                <CheckBox
            ref={(checkbox)=>{
                CheckBoxRefs[`${CheckBoxName}${key}`] = checkbox;
            }}
            id = {key}
            style={{marginRight:12}}
            isChecked={this.state.isAllSelect}
            onChange={(id,isChecked)=>{
                if(isChecked){
                    toDeleteIds.push(id);
                }else {
                    var index = toDeleteIds.indexOf(id);
                    if(index >= 0){
                        toDeleteIds.splice(index,1);
                    }
                }
            }}
        />
        );
        }
        return checkbox;
    },
    _onItemLongPress(){
        if(!this.state.isDeleteMode){
            hasChange = true;
            this.setState({
                //一定要调用这个，否则列表不会刷新，ListView.DataSource$rowHasChanged不会被调用
                //列表是否刷新取决于ListView.DataSource$rowHasChanged的返回值，true表示刷新,false表示不用刷新
                dataSource:this.state.dataSource.cloneWithRows(datas),
                isDeleteMode:true,
            });
        }else {
            hasChange = false;
        }
    },
    _onDeletePress(){
        console.log('JSON.stringify(toDeleteIds)',JSON.stringify(toDeleteIds));


    },
    showRightButton(){
        return this.state.isDeleteMode;
    },

    onRightButtonPress(){
        this._selectAll();
        return true;
    },



    _selectAll(){
        this.setState({
            isAllSelect:!this.state.isAllSelect,
        });
        for (var key in CheckBoxRefs){
            var item = CheckBoxRefs[key];
            if(item){
                item.check(!item.isCheck());
            }else {
                delete CheckBoxRefs[key];
            }
        }
    },
    _onCancelPress(){
        hasChange = true;
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(datas),
            isDeleteMode:false,
            isAllSelect:false,
        });
        //清空
        toDeleteIds = [];
    },



    /**
     ********************* 复选框相关 *******END************
     *
     */
    pushToNewsDetail(data){
        if(!this.state.isDeleteMode) {
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.push({

                    component: UPloadFile
                });
            }
        }else {
            var item = CheckBoxRefs[`${CheckBoxName}${data.id}`];
            if(item){
                item.check(!item.isCheck());
            }
        }
    },
    _onRefresh(){
        this.loadDataFromNet();
        datas = [];
        index = 1;
        CheckBoxRefs = {};
    },
    // 处理一些复杂的操作
    componentDidMount(){
        this.loadDataFromNet();
        datas = [];
        index = 1;
        CheckBoxRefs = {};
    },
    //网络请求
    loadDataFromNet() {
        fetch(this.props.url_api)
            .then((response)=>response.json())
    .then((responseData)=>{
            console.log(responseData);
        // 拿到所有的数据
        //处理网络数据
        this.dealWithData(responseData);
    })
    .catch((error)=>{
            if(error){
                console.log(error);
            }
        })
    },
    //处理网络数据
    dealWithData(jsonData){
        jsonData.map((item,index)=>{

            // console.log("item",item,index)
        })
        datas = datas.concat(jsonData);
        //更新状态机
        this.setState({
            isDeleteMode:false,
            isAllSelect:false,
            //cell的数据源
            dataSource:this.state.dataSource.cloneWithRows(jsonData)
        })
    },
});
// 样式
const styles = StyleSheet.create({
    container: {
        flex:1
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
//Native样式
    navImageStyle:{
        width:Platform.OS == 'ios' ? 28: 24,
        height:Platform.OS == 'ios' ? 28: 24,
    },

    leftViewStyle:{
        // 绝对定位
        position:'absolute',
        left:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },

    NavrightViewStyle:{
        // 绝对定位
        position:'absolute',
        right:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },

    navOutViewStyle:{
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(255,255,255,1.0)',

        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 主轴方向居中
        justifyContent:'center'
    },

    NavRightBtnOneStyle:{
        width: 40,
        height: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        // 绝对定位
        position:'absolute',
        right:10,
        top:25
    },
    NavRightBtnTwoStyle:{

    },
    //ListViewCell样式

    leftImageStyle:{
        width:100,
        height:100,
    },


    CellrightViewtitleStyle:{
        fontSize:10,
        color:'black',
        height:20,
        right:10,

    },

    CellRightSubViewStyle:{
        marginTop:45,
        marginRight:10,
        justifyContent:'space-around',
        flexDirection:'row',

    },
    CellRightSubexit: {
        width: 40,
        height: 20,
        marginBottom:0,
        marginLeft:10,
        marginRight:10,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
    },
    CellRightSubexittext: {
        height: 20,
        fontSize: 12,
        marginTop:9
    },

    subTitleStyle:{
        fontSize:14,
        color:'gray',
    },
    followTitleStyle:{
        //绝对定位
        position:'absolute',
        right:10,
        bottom:0,
        //设置边框
        borderWidth:0.5,
        borderColor:'gray',
        borderRadius:5,
        padding:0,
        color:'gray',
        height:17,
        justifyContent:'center'

    },
    cellViewStyle:{
        //设置间距
        padding:10,
        // 设置下边框
        borderBottomColor:'#e8e8e8',
        borderBottomWidth:0.5,
        flexDirection:'row',

    },
    CellrightViewStyle:{

        marginRight:0,
        // 距离左边的间距
        marginLeft:0,
        marginTop:0,
        marginBottom:0,


    },
    imgStyle:{
        width:90,
        height:90,

    },

});
// 输出组件类
module.exports = ZPchexkbox;
