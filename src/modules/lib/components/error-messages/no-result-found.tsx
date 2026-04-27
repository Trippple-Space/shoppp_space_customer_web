import Image from '../image/Image';

const NoResultMessage = ({
  textContent,
  contentTitle,
  contentStyle,
}: {
  textContent?: string;
  contentTitle?: string;
  contentStyle?: React.CSSProperties;
}) => {
  return (
    <div className="flex flex-col a-items-center gap-8 py-16">
      <Image
        src="empty-tray.png"
        className="w-184 h-152 object-fit-scale-down"
        alt="empty"
      />
      {contentTitle && (
        <h1 className="text-24 l:text-30 line-height-40 md:my-15 my-10 weight-700 text-center" style={{textWrap: 'balance', textAlign: 'center'}}>
          {contentTitle}
        </h1>
      )}
      {textContent && (
        <p className={`text-14 weight-400 line-height-22 color-#00000073 px-12 py-5 max-w-400`} style={{textWrap: 'balance', textAlign: 'center', whiteSpace: 'pre-line', ...contentStyle}}>
          {textContent}
        </p>
      )}
    </div>
  );
};

export default NoResultMessage;
