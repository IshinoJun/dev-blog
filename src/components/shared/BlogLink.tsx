import * as React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Blog from '../../models/Blog';
import style from './BlogLink.module.scss';
import BlogDate from './BlogDate';

interface Props {
  nextBlog: Blog;
  prevBlog: Blog;
}

const BlogLink: React.FC<Props> = (props: Props) => {
  const { nextBlog, prevBlog } = props;

  return (
    <ul className={style.blogLink}>
      <li>
        {prevBlog && prevBlog.id && (
          <Link href="/blogs/[id]" as={`/blogs/${prevBlog.id}`}>
            <a>
              <ArrowBackIcon
                fontSize="large"
                className={style.arrow}
                style={{ marginRight: 20 }}
              />
              <div>
                <p className={style.tag}>
                  <LocalOfferIcon />
                  {prevBlog.tags?.map((tag, index) => (
                    <span key={index}>
                      {tag.name}
                      {index + 1 !== prevBlog.tags?.length ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className={[style.text, style.ellipsis].join(' ')}>
                  {prevBlog.title}
                </p>
                <BlogDate blog={prevBlog} />
              </div>
            </a>
          </Link>
        )}
      </li>
      <li>
        {nextBlog && nextBlog.id && (
          <Link href="/blogs/[id]" as={`/blogs/${nextBlog.id}`}>
            <a>
              <div style={{ marginLeft: 55 }}>
                <p className={style.tag}>
                  <LocalOfferIcon />
                  {nextBlog.tags?.map((tag, index) => (
                    <span key={index}>
                      {tag.name}
                      {index + 1 !== nextBlog.tags?.length ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className={[style.text, style.ellipsis].join(' ')}>
                  {nextBlog.title}
                </p>
                <BlogDate blog={nextBlog} />
              </div>
              <ArrowForwardIcon
                fontSize="large"
                className={style.arrow}
                style={{ marginLeft: 20 }}
              />
            </a>
          </Link>
        )}
      </li>
    </ul>
  );
};

export default BlogLink;