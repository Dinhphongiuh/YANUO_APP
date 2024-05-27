import React from "react";
import { Dimensions, Pressable } from "react-native";

const {height, width} = Dimensions.get('window');
const Backdrop = ({...rest}) => {
    return (
        <Pressable
            {...rest}
            style={{
                position: 'absolute', 
                width: Dimensions.get('window').width * 2, 
                height: Dimensions.get('window').height * 5, 
                // backgroundColor: 'green',
                top: -height,
                left: -20,
            }}
        ></Pressable>
    )
};

export default Backdrop;