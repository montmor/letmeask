import './style.scss';
import { ReactNode } from 'react';
import cx from 'classnames';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isHighLighted?: boolean;
  isAnsered?: boolean;
};

export function Question({
  content,
  author,
  children,
  isAnsered = false,
  isHighLighted = false,
}: QuestionProps) {
  return (
    <div
      className={cx(
        'question',
        { answered: isAnsered },
        { highLighted: isHighLighted && !isAnsered },
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
