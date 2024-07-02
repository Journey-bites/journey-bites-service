import truncate from 'truncate-html';

export const truncateHtml = (content: string) => {
  return truncate(content, { length: 100, stripTags: false });
};
