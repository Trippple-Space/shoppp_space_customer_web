import Image from '../image/Image';

const NoResultMessage = ({
  textContent,
  contentTitle,
}: {
  textContent?: string;
  contentTitle?: string;
}) => {
  return (
    <div className="flex flex-col a-items-center gap-8 py-16">
      <Image
        src="empty-tray.png"
        className="w-184 h-152 object-fit-scale-down"
        alt="empty"
      />
      {contentTitle && (
        <h1 className="text-24 l:text-30 line-height-40 my-15 weight-700 text-center">
          {contentTitle}
        </h1>
      )}
      {textContent && (
        <p className="text-14 weight-400 line-height-22 color-#00000073 w-320 px-12 py-5">
          {textContent}
        </p>
      )}
    </div>
  );
};

export default NoResultMessage;
