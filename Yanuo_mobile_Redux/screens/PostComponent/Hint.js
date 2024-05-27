import React from "react";
import {View as MotiView} from 'moti';
import { Text, View } from "react-native";

export default function Hint({hint}) 
{
    return (
        <MotiView
            // from={{opacity: 0}} 
            style={[{
                position: 'absolute', 
                bottom: 0, 
                backgroundColor: '#fff', 
                zIndex: 9,
                width: '100%', 
                height: 50,
                alignItems: 'center',
                justifyContent: 'center'
            }, 
                // !hint && 
            // {flexDirection: "row", alignItems: "center", justifyContent: 'space-evenly',}
        ]}>
            {
                hint && (
                    <Text style={{fontSize: 14, textAlign: "center", color: '#68686a', fontWeight: '600'}}>Nhấn để chọn cảm xúc</Text>
                )
            }
        </MotiView>
    )
}