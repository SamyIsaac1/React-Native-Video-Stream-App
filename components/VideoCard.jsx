import { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import { icons } from '../constants';
import { updateFavories } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';

const VideoCard = ({ id, title, creator, avatar, thumbnail, video }) => {
  const { user, setUser } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const favoritesIds = user.favorites.map((item) => item.$id);
  const isInclude = favoritesIds.includes(id);

  async function toggleFavorites() {
    try {
      setIsLoading(true);

      const result = await updateFavories(
        user,
        isInclude
          ? favoritesIds.filter((favId) => favId !== id)
          : [...favoritesIds, id]
      );

      setUser(result);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <View className='relative flex flex-col items-center px-4 mb-14'>
      <View className='flex flex-row gap-3 items-start'>
        <View className='flex justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5'>
            <Image
              source={{ uri: avatar }}
              className='w-full h-full rounded-lg'
              resizeMode='cover'
            />
          </View>

          <View className='flex justify-center flex-1 ml-3 gap-y-1'>
            <Text
              className='font-psemibold text-sm text-white'
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className='text-xs text-gray-100 font-pregular'
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className='pt-2'>
          <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className='w-full h-60 rounded-xl mt-3'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className='w-full h-60 rounded-xl mt-3 relative flex justify-center items-center'
        >
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />

          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className='absolute right-8 top-20 z-10'
        activeOpacity={0.7}
        onPress={toggleFavorites}
      >
        {isLoading ? (
          <Text>⭕</Text>
        ) : (
          <Text className='text-white'>{isInclude ? '❤' : '🤍'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
