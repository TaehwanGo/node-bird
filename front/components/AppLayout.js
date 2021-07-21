import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col, Switch } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user); // isLoggedIn이 바뀌면 알아서 re-rendering 됨

  // 좋아 나중에 리덕스로 다크모드 관리해보자
  const [theme, setTheme] = useState('light');
  let body;
  useEffect(() => {
    body = document.querySelector('body');
  });

  const changeTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      body.classList.remove('dark-mode');
    } else {
      setTheme('dark');
      body.classList.add('dark-mode');
    }
  };

  return (
    <div>
      <Global />
      <Menu mode="horizontal" theme={theme}>
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Switch
            checked={theme === 'light'}
            onChange={changeTheme}
            checkedChildren="Light"
            unCheckedChildren="Dark"
          />
        </Menu.Item>
      </Menu>

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://www.taehwango.info"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by Tony
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
