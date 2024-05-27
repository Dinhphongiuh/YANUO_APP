import React from "react";
import {View as MotiView} from 'moti';
import { Text, View } from "react-native";

export default function Hint({hint}) 
{
    return (
        <MotiView
            from={{opacity: 0}} 
            style={[{position: 'absolute', bottom: 0, backgroundColor: '#fff', zIndex: 9, width: '100%', height: 56}, !hint && 
            {flexDirection: "row", alignItems: "center", justifyContent: 'space-evenly',}
        ]}>
            {hint ? 
                <Text style={{fontSize: 16, textAlign: "center"}}>Release to cancel</Text> : Array.from({length: 10}).map((_, index) => 
                <View key={index} style={{width: 5, height: 5, backgroundColor: '#eee'}}></View>
            )
            }
        </MotiView>
    )
}