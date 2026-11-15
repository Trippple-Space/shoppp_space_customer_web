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
    <div className="flex flex-col items-center gap-[8px] py-[16px]">
      <Image
        src="empty-tray.png"
        className="w-[184px] h-[152px] object-fit-scale-down"
        alt="empty"
      />
      {contentTitle && (
        <h1 className="text-[24px] lg:text-[30px] leading-[40px] md:my-[15px] my-[10px] font-bold text-center" style={{textWrap: 'balance', textAlign: 'center'}}>
          {contentTitle}
        </h1>
      )}
      {textContent && (
        <p className={`text-[14px] font-normal leading-[22px] text-[#00000073] px-[12px] py-[5px] max-w-[400px]`} style={{textWrap: 'balance', textAlign: 'center', whiteSpace: 'pre-line', ...contentStyle}}>
          {textContent}
        </p>
      )}
    </div>
  );
};

export default NoResultMessage;
