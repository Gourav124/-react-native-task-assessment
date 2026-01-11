import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ErrorSnackBarProps = {
    visible:boolean,
    message:string,
    onRetry:() => void,
    onDismiss ?:() => void
};

const ErrorSnackBar:React.FC<ErrorSnackBarProps> = ({
    visible,
    message,
    onRetry,
    onDismiss
}) => {
    const slideAnimation = useRef(new Animated.Value(-100)).current;
    useEffect(() => {
        if(visible){
            Animated.spring(slideAnimation,{
                toValue:0,
                useNativeDriver:true,
                tension:50,
                friction:7
            }).start();
        } else {
            Animated.timing(slideAnimation,{
                toValue: -100,
                duration:200,
                useNativeDriver:true,
            }).start();
        }
    },[visible])

    if (!visible) {
        return null;
    }

    return(
        <Animated.View style = {[styles.container,{transform:[{translateY:slideAnimation}]}]}>
            <View style = {{flexDirection:'row',alignItems:'center',padding:16}}>
                <Text style = {{flex:1,color:'white',fontSize:14,fontWeight:'500'}}>{message}</Text>
                <TouchableOpacity 
                style = {{
                    backgroundColor:'#FFFFFF33',
                    paddingHorizontal:16,
                    paddingVertical:8,
                    borderRadius:4,
                    marginLeft:12
                }}
                onPress={onRetry}
                >
                    <Text style = {{color:'white',fontSize:14,fontWeight:'bold'}}>RETRY</Text>
                </TouchableOpacity>

                {
                    onDismiss && (
                        <TouchableOpacity onPress={onDismiss}>
                            <Text style = {{color:'white',fontSize:18,fontWeight:'bold'}}>X</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </Animated.View>

    )
}

export default ErrorSnackBar;

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:20,
        left:16,
        right:16,
        backgroundColor:'#e74c3c',
        borderRadius:8,
        elevation:6,
        shadowColor:'#000',
        shadowOpacity:0.3,
        shadowOffset:{width:0,height:2},
        shadowRadius:4,
    }
})