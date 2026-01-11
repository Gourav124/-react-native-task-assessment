import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const PostSkeleton = () => {
    return (
        <ShimmerPlaceholder style={styles.postContainer}>
            <ShimmerPlaceholder style={styles.title} />
            <ShimmerPlaceholder style={styles.body} />
        </ShimmerPlaceholder>
    )
}

export default PostSkeleton

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#9e9e9e',
        margin: 10,
        borderRadius: 8,
        padding: 35,
        width:'100%'
    },
    title: {
        height: 18
    },
    body: {
        height: 18
    },
})