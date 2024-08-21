import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.aora',
  projectId: '66c47fc800256b3d9dfe',
  databaseId: '66c480e40001477450f9',
  userCollectionId: '66c48107001949fa7819',
  videoCollectionId: '66c4812a002a34b8dd61',
  storageId: '66c4828800203b4e586c',
};
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search('title', query),
    ]);

    if (!posts) throw new Error('Something went wrong');

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//  Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal('creator', userId),
    ]);

    if (!posts) throw new Error('Something went wrong');

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc('$createdAt'),
      Query.limit(7),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
