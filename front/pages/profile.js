import React from 'react'; // next에선 안해도 됨(해도 상관은 없음)
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
  const followerList = [
    { nickname: 'tony' },
    { nickname: 'noah' },
    { nickname: 'minsu' },
  ];
  const followingList = [
    { nickname: 'tony' },
    { nickname: 'noah' },
    { nickname: 'minsu' },
  ];
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
