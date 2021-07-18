import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = (
  { postData }, // '첫 번째 게시글 #헤시태그 #익스프레스'
) => (
  <div>
    {postData.split(/(#[^\s#]+)/g).map((v, i) => {
      if (v.match(/#[^\s#]+/)) {
        return (
          <Link key={i} href={`/hashtag/${v.slice(1)}`}>
            <a>{v}</a>
          </Link>
        );
      }
      return v;
    })}
  </div>
);

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
