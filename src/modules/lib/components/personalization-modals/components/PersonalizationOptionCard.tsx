import Image from '@/modules/lib/components/image/Image';

interface PersonalizationOptionCardProps {
  label: string;
  imageSrc: string;
  selected: boolean;
  onSelect: () => void;
}

const PersonalizationOptionCard = ({
  label,
  imageSrc,
  selected,
  onSelect,
}: PersonalizationOptionCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col a-items-center j-content-center gap-10 sm:gap-12 p-12 sm:p-16 radius-9 border-solid border-1 cursor-pointer w-full min-w-0 ${
        selected
          ? 'border-#0B9378 bg-#0B937817'
          : 'border-#F5F5F5 bg-#F5F5F5'
      }`}
    >
      <div className="w-56 sm:w-64 h-56 sm:h-64 flex j-content-center a-items-center">
        <Image
          src={imageSrc}
          alt={label}
          type="icon"
          className="w-100p h-100p g|object-fit:contain"
        />
      </div>
      <span className="text-12 sm:text-14 weight-500 color-#000000">{label}</span>
    </button>
  );
};

export default PersonalizationOptionCard;
