import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { useGlobalContext } from '../../context/GlobalProvider';
import { EmptyState, InfoBox, VideoCard } from '../../components';
import useAppwrite from '../../lib/useAppwrite';
import { updateFavories } from '../../lib/appwrite';

const Bookmark = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={user.favorites}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            id={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Videos Found'
            subtitle='No videos found for Bookmark'
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full flex justify-center items-center mt-6 mb-12 px-4'>
            <Text className='text-2xl text-white font-psemibold'>
              <Text className='text-secondary-100'>
                {user.favorites.length}
              </Text>{' '}
              Saved Videos
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
