import React from 'react';
import { Rate } from 'rsuite';

export default function CommentList({ comments }) {
  const commentRows = comments.map(comment => (
    <div key={comment.id}>
      <p style={{ fontSize: '16px' }}>
        <Rate
          value={comment.rating}
          readOnly
          size="xs"
        />
        {'   '}
        {comment.author}
        {' '}
        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
          .format(new Date(Date.parse(comment.date)))}
      </p>
      <p style={{ fontSize: '18px' }}>{comment.comment}</p>
      <hr />
    </div>
  ));

  return (
    <div>
      <h3>Reviews</h3>
      {commentRows}
    </div>
  );
}
