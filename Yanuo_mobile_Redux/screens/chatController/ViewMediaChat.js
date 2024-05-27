import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, PanResponder, ActivityIndicator, Modal, TextInput,} from 'react-native';
import {Video} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function App({navigation, route}) {
    const uri = route.params;
    console.log(uri);

    // Hàm kiểm tra định dạng file
    const isImage = (uri) => {
        return uri.match(/\.(jpeg|jpg|gif|png|bmp|heic)$/i);
    };

    const isVideo = (uri) => {
        return uri.match(/\.(mp4|avi|mov|wmv|flv)$/i);
    };
    const VideoRef = useRef(null);

    const downloadVideo = async (videoUrl) => {
        let fileUri = FileSystem.documentDirectory + 'video.mp4';
        console.log(fileUri);
        try {
          const res = await FileSystem.downloadAsync(videoUrl, fileUri);
          const asset = await MediaLibrary.createAssetAsync(res.uri);
          const album = await MediaLibrary.getAlbumAsync('Download');
          if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
          alert('Video downloaded successfully');
          console.log('success')
        } catch (error) {
          console.error('Error downloading video:', error);
        }
      };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: '100%', height: 50}}>
                <TouchableOpacity
                    onPress={() => downloadVideo(uri)}
                >
                    <Text>Download</Text>
                </TouchableOpacity>
            </View>
            {isImage(uri) && 
            <Image
                source={{uri}}
                resizeMode='contain'
                style={{width: '100%', height: '100%'}}
            ></Image>}
            {isVideo(uri) && (
                // Sử dụng thư viện thích hợp để hiển thị video, ví dụ: react-native-video
                <Video 
                    ref={VideoRef}
                    source={{ uri: uri }} 
                    useNativeControls
                    resizeMode = 'cover' 
                    isLooping
                    style={{width: '100%', height: '100%'}}
                    shouldPlay
                >
                </Video>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})