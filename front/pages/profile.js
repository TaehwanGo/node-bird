import React from 'react'; // next에선 안해도 됨(해도 상관은 없음)
import AppLayout from '../components/AppLayout';
import Head from 'next/head';

const Profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <div>내 프로필</div>
      </AppLayout>
    </>
  );
};

export default Profile;
