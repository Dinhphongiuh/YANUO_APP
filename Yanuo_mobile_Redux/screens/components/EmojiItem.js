import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import {View as MotiView, AnimatePresence, useAnimationState} from "moti";

export default function EmojiItem({data, index, scaled, ...rest})
{
    const animatedState = useAnimationState({scaleIn: {
            scale: 1.4
        },
        scaleOut: {
            scale: 1
        }
    });
    useEffect(() => {
        animatedState.transitionTo(scaled ? "scaleIn" : "scaleOut")
    }, [scaled]);
    return (
    <Pressable {...rest} style={styles.root}>
        <AnimatePresence exitBeforeEnter>
            {scaled && (
                <MotiView
                    style={styles.titleBox}
                    from={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 0}}
                >
                </MotiView>
            )}
        </AnimatePresence>
        <MotiView 
            from={{transform: [{translateY: 40}, {scale: 1}]}}
            animate={{transform: [{translateY: 0}, {scale: 1}]}}
            exit={{transform: [{translateY: 40}, {scale: ((1 / 6) * index) / 10}]}}
            transition={{delay: (index + 1) * 50}}
        >
            <MotiView state={animatedState}>{data.emojis}</MotiView>
        </MotiView>
    </Pressable>
    )
};

const styles = StyleSheet.create({
    root: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: 'red',
        // position: 'absolute',
    }
})