import { FC } from 'react';
import ReactPaginate from 'react-paginate';
import s from './Paginate.module.scss';

export interface PaginateProps {
  pageCount: number;
  learned: boolean;
  forcePage?: number;
  onPageChage?: (selectedItem: { selected: number }) => void;
}

const Paginate: FC<PaginateProps> = ({ pageCount, learned, forcePage, onPageChage }) => {
  const pageRangeDisplayed = (): number => {
    if (forcePage === 0 || forcePage === 28 || forcePage === 29) return 5;
    if (forcePage === 1 || forcePage === 2 || forcePage === 27) return 4;
    return 2;
  };

  return (
    <div className={s.root}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={onPageChage}
        pageRangeDisplayed={pageRangeDisplayed()}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel="<"
        forcePage={forcePage}
        renderOnZeroPageCount={(): null => null}
        containerClassName={s.container}
        pageClassName={s.page}
        pageLinkClassName={s.link}
        previousClassName={s.prev}
        nextClassName={s.next}
        activeLinkClassName={`${s.activeLink}${learned ? ` ${s.activeLink_learned}` : ''}`}
        disabledClassName={s.disabled}
        breakClassName={s.break}
      />
    </div>
  );
};

export default Paginate;
