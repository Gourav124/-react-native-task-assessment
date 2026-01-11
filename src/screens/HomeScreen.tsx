import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Image, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PostCard from '../components/PostCard'
import PostSkeleton from '../components/PostSkeleton'

type Post = {
    userId: number
    id: number
    title: string
    body: string
}

const HomeScreen = () => {

    const [data, setData] = useState<Post[]>([])
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false)
    const [skeletonLoader, setSkeletonLoader] = useState(false);
    const STORAGE_KEY = 'search_query';

    const fetchData = async () => {
        try {
            setLoading(true);
            setSkeletonLoader(false);
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            const json = await res.json();
            console.log(json);
            setData(json);
            setLoading(false);
            setSkeletonLoader(true);

            setTimeout(() => {
                setSkeletonLoader(false)
            }, 3000);

        } catch (error) {
            Alert.alert(
                'Unable to fetch posts.',
                'Check your network connection!',
                [
                    {
                        text: 'Retry',
                        onPress: () => fetchData()
                    },

                    {
                        text: 'Cancel'
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    }

    const saveQuery = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, query);
        } catch (error) {
            console.log('Error:', error)
        }
    }

    const loadQuery = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setQuery(saved);
            }
        } catch (error) {
            console.log('Error : ', error)
        }
    }

    const filterPost = useMemo(() => {
        const q = query.trim().toLowerCase();
        return data.filter((t) => t.title.toLowerCase().includes(q));
    }, [data, query])

    useEffect(() => {
        fetchData();
        loadQuery();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Image
                        source={require('../icons/search.png')}
                        style={styles.icon}
                    />
                    <TextInput
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text)
                            saveQuery();
                        }}
                        placeholder='Search posts...'
                    />
                </View>
                {
                    loading ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size='large' />
                        </View>
                    ) : skeletonLoader ? (
                        <FlatList
                            data={[1, 2, 3, 4, 5, 6, 7, 8, 9,10]}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={
                                () => <PostSkeleton />
                            }
                        />
                    ) : (
                        <FlatList
                            data={filterPost}
                            keyExtractor={(item => item.id.toString())}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle = {{flexGrow:1}}
                            ListEmptyComponent={
                                <View style={styles.emptyListContainer}>
                                    <Text style={{ fontSize: 18 }}>No posts found!</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <PostCard
                                    title={item.title}
                                    body={item.body}
                                />
                            )}
                        />)
                }
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#000',
        margin: 8
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    }
})