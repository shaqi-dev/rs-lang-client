import { FC, useState, useEffect, MouseEvent, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import WordButton from '../../components/WordButton';
import ErrorBanner from '../../components/ErrorBanner';
import { getWords } from '../../services/words';
import type { Word } from '../../interfaces/words';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectCurrentGroup,
  selectCurrentPage,
  setGroup,
  setPage,
} from '../../store/textbook/textbookSlice';
import s from './Textbook.module.scss';

const wordsGroups = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const group = useAppSelector(selectCurrentGroup);
  const page = useAppSelector(selectCurrentPage);
  const maxPages = 30;

  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [serverError, setServerError] = useState<Error | null>(null);

  const updateWords = useCallback(async (): Promise<void> => {
    const { data, error } = await getWords({
      group,
      page,
    });

    if (error) setServerError(error);
    if (data) {
      setCurrentWords(data);
      setCurrentWord(data[0]);
    }
  }, [group, page]);

  useEffect(() => {
    updateWords();
  }, [group, page, updateWords]);

  const handleClickGroup = (e: MouseEvent<HTMLButtonElement>): void => {
    const { innerText } = e.target as HTMLButtonElement;
    const selectedGroup = wordsGroups.indexOf(innerText);

    if (group !== selectedGroup) {
      dispatch(setGroup(selectedGroup));
      dispatch(setPage(0));
    }
  };

  const handleClickWord = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    const word = currentWords.filter((item) => item.word === button.innerText)[0];
    setCurrentWord(word);
  };

  const levelButtons = wordsGroups.map((groupName, i) => {
    const active = i === group;
    return (
      <EnglishLevelButton key={groupName} active={active} onClick={handleClickGroup}>
        {groupName}
      </EnglishLevelButton>
    );
  });

  const wordElements = currentWords.map((word, i) => {
    const active = (currentWord && currentWord.word === word.word) || (!currentWord && i === 0);

    return (
      <WordButton key={word.word} active={active} onClick={handleClickWord}>
        {word.word}
      </WordButton>
    );
  });

  const handleChangePage = ({ selected }: { selected: number }): void => {
    dispatch(setPage(selected));
  };

  const getPageRangeDisplayedValue = (): number => {
    if (page === 0 || page === 28 || page === 29) return 5;
    if (page === 1 || page === 2 || page === 27) {
      return 4;
    }
    return 2;
  };

  const paginate = (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={handleChangePage}
      pageRangeDisplayed={getPageRangeDisplayedValue()}
      marginPagesDisplayed={1}
      pageCount={maxPages}
      previousLabel="<"
      forcePage={page}
      renderOnZeroPageCount={(): null => null}
      containerClassName={s.pagination_container}
      pageClassName={s.pagination_page}
      pageLinkClassName={s.pagination_link}
      previousClassName={s.pagination_prev}
      nextClassName={s.pagination_next}
      activeLinkClassName={s.pagination_activeLink}
      disabledClassName={s.pagination_disabled}
      breakClassName={s.pagination_break}
    />
  );

  const serverErrorBanner = (
    <ErrorBanner>
      `${serverError?.name}: ${serverError?.message}`
    </ErrorBanner>
  );

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.levelsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <div className={s.levelsButtons}>{levelButtons}</div>
      </section>
      <section className={s.wordsSection}>
        <p className={s.sectionTitle}>Слова</p>
        <div className={s.wordsBody}>
          <div className={s.wordsButtons}>
            {serverError && serverErrorBanner}
            {!serverError && wordElements}
          </div>
          <div className={s.wordsCard}>
            {currentWord && `${currentWord.word} - ${currentWord.wordTranslate}`}
          </div>
        </div>
        <div className={s.pagination}>{currentWords && paginate}</div>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
