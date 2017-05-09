import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight
} from 'react-native'

export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.isChecked,
        };
        if (this.props.onChange) {
            this.props.onChange(this.props.id, this.props.isChecked);
        }
    }

    static propTypes = {
        ...View.propTypes,
        checkedImage: React.PropTypes.element,
        unCheckedImage: React.PropTypes.element,
        onChange: React.PropTypes.func,
        isChecked: React.PropTypes.bool,
        id:React.PropTypes.number,
    };

    static defaultProps = {
        isChecked: false,
    };

    isCheck(){
        return this.state.isChecked;
    }

    check(isChecked){
        if(isChecked != this.state.isChecked) {
            this.setState({
                isChecked: isChecked
            });
            if (this.props.onChange) {
                this.props.onChange(this.props.id, isChecked);
            }
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={this.props.style}
                onPress={()=>{
                    var isChecked = !this.state.isChecked;
                    this.check(isChecked);
                }}
                underlayColor='transparent'
            >
                <View style={styles.container}>
                    {this._renderImage()}
                </View>
            </TouchableHighlight>
        )
    }

    _renderImage() {
        if (this.state.isChecked) {
            return this.props.checkedImage ? this.props.checkedImage : this.getCheckedImage();
        } else {
            return this.props.unCheckedImage ? this.props.unCheckedImage : this.getCheckedImage();
        }
    }

    getCheckedImage() {
        var source = this.state.isChecked ? require('./img/icon_check.png') : require('./img/icon_no_check.png');

        return (
            <Image style={{height:25,width:25}} source={source}/>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftText: {
        flex: 1,
    },
    rightText: {
        flex: 1,
        marginLeft: 20
    }
});