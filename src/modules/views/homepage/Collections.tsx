import { useCollections } from '@/modules/lib/utility/hooks/use-collections';
import CollectionSection from './CollectionSection';

const Collections = ({ storeId }: { storeId: string }) => {
  const { collections, loading: loadingCollections } = useCollections({
    storeId,
    type: null,
  });

  /*  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null); */

  if (loadingCollections) return <p>Loading collections...</p>;

  return (
    <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col gap-20">
      {/* {(!!newArrivals?.length || !!dealsForYou.length) && (
          <div className="px-24 sm:px-40 md:px-60 l:px-100 xl:px-200 flex flex-col gap-20">
            {!!newArrivals?.length && (
              <section
                className={`bg-#FEFBE8 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
                key={newArrivals[0]?.id}
              >
                <div className="flex flex-row j-content-between a-items-center">
                  <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                    New arrivals
                  </h3>

                  {newArrivals?.length > 4 && (
                    <Link
                      href={'/'}
                      className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
                    >
                      <span className="sm:text-16 text-14 weight-600">
                        View more
                      </span>
                      <MdChevronRight className="w-16 h-16 sm:inline hidden" />
                    </Link>
                  )}
                </div>
                <div className="scroll-x no-scrollbar" ref={scrollRef1}>
                  <div
                    className={`flex h-fit ${
                      newArrivals?.length && 'w-fit'
                    } whitespace-nowrap gap-14`}
                  >
                    {newArrivals?.length ? (
                      newArrivals?.map((product, i) => (
                        <div
                          key={i}
                          className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30"
                        >
                          <ProductTile
                            product={product}
                            key={i}
                            allReviews={allReviews}
                            id={product.id}
                            isOpen={openReviewId}
                            setIsOpen={setOpenReviewId}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="mt-60 text-center flex-grow-1">
                        No products found for new arrivals
                      </div>
                    )}
                  </div>
                </div>
                <ScrollButtons
                  scrollRef={scrollRef1}
                  page={'productScroll'}
                  scrollLength={newArrivals.length}
                  component={'products'}
                />
              </section>
            )}

            {!!dealsForYou.length && (
              <section
                className={`bg-#FFF3F1 radius-16 sm:p-24 p-20 flex flex-col md:gap-24 sm:gap-20 gap-24 w-full relative`}
                key={dealsForYou[0]?.id}
              >
                <div className="flex flex-row j-content-between a-items-center">
                  <h3 className="sm:text-24 text-20 weight-600 color-#000000E0">
                    Deals for you
                  </h3>
                  {dealsForYou?.length > 4 && (
                    <Link
                      href={'/'}
                      className="bg-black text-white sm:py-8 py-6 px-14 flex flex-row a-items-center gap-6 radius-6"
                    >
                      <span className="sm:text-16 text-14 weight-600">
                        View more
                      </span>
                      <MdChevronRight className="w-16 h-16 sm:inline hidden" />
                    </Link>
                  )}
                </div>
                <div className="scroll-x no-scrollbar" ref={scrollRef2}>
                  <div
                    className={`flex h-fit ${
                      newArrivals?.length && 'w-fit'
                    } whitespace-nowrap gap-14`}
                  >
                    {dealsForYou.length ? (
                      dealsForYou.map((product, i) => (
                        <div
                          key={i}
                          className="l:w-238 md:w-230 sm:w-220 w-150 l:mt--20 mt--30"
                        >
                          <ProductTile
                            product={product}
                            key={i}
                            allReviews={allReviews}
                            id={product.id}
                            isOpen={openReviewId}
                            setIsOpen={setOpenReviewId}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="mt-60 text-center flex-grow-1">
                        No products found for deals for you
                      </div>
                    )}
                  </div>
                </div>
                <ScrollButtons
                  scrollRef={scrollRef2}
                  page={'productScroll'}
                  scrollLength={dealsForYou.length}
                  component={'products'}
                />
              </section>
            )}
          </div>
        )} */}
      {collections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default Collections;
