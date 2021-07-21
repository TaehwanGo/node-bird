import React, { useCallback, useEffect } from 'react';
import { Button, Form, Input } from 'antd/';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector(state => state.user.me?.id);
  const { addCommentDone } = useSelector(state => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    dispatch({
      // 재사용 될 것이라면 함수로 빼는 게 좋음
      // component에서만 쓸거면 action 개체 하나를 dispatch에 직접 넣는 것도 방법임
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id }, // 동적 action creator를 만들지 아니면 이렇게 변수를 사용해서 직접 create를 할지는 선택임
    });
  }, [commentText, id]);
  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
        <Button
          style={{
            position: 'absolute',
            right: 0,
            bottom: -40,
            zIndex: 10,
          }}
          type="primary"
          htmlType="submit"
        >
          응애
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
