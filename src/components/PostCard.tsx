import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

type PostCardProps = {
    title: string,
    body: string
}

const PostCard: React.FC<PostCardProps> = ({ title, body }) => {

    const formatText = (text: any) => {
        return text.replace(/\s+/g, " ").trim();
    }

    return (
        <View style={styles.postContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.body} numberOfLines={3}>{formatText(body)}</Text>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#bdc3c7',
        margin: 10,
        borderRadius: 8,
        padding: 8
    },
    title: {
        fontSize: 18,
        fontWeight: 'semibold'
    },
    body: {
        fontSize: 13,
        fontWeight: 'semibold'
    },
})