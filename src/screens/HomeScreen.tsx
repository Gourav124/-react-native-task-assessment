import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Image, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorSnackBar from '../components/ErrorSnackBar'

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
    const [error, setError] = useState<string | null>(null);
    const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
    const STORAGE_KEY = 'search_query';

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            const json = await res.json();
            console.log(json);
            setData(json);
        } catch (error) {
            console.log('Error : ', error)
            setError('Unable to fetch posts. Check your network connection');
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

    const formatText = (text: any) => {
        return text.replace(/\s+/g, " ").trim();
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
                    loading
                        ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size='large' />
                        </View>
                        :
                        <FlatList
                            data={filterPost}
                            keyExtractor={(item => item.id.toString())}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyListContainer}>
                                    <Text style={{ fontSize: 18 }}>No posts found!</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <View style={styles.postContainer}>
                                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.body} numberOfLines={3}>{formatText(item.body)}</Text>
                                </View>
                            )}
                        />
                }

                <ErrorSnackBar
                    visible={!!error}
                    message={error || ''}
                    onRetry={() => {
                        if (retryAction) {
                            setRetryAction(() => fetchData())
                        }
                    }}
                    onDismiss={() => setError(null)}
                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
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
    icon: {
        width: 20,
        height: 20,
        tintColor: '#000',
        margin: 8
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})