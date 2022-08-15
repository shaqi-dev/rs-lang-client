import { FC, useState, useEffect, MouseEvent, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import WordButton from '../../components/WordButton';
import ErrorBanner from '../../components/ErrorBanner';
import { getWords } from '../../services/words';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Textbook: FC = () => {
  const [currentLevel, setCurrentLevel] = useState<string>(englishLevels[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [serverError, setServerError] = useState<Error | null>(null);

  const maxPages = 30;

  const updateWords = useCallback(async (): Promise<void> => {
    const { data, error } = await getWords({
      group: englishLevels.indexOf(currentLevel),
      page: currentPage - 1,
    });

    if (error) setServerError(error);
    if (data) {
      setCurrentWords(data);
      setCurrentWord(data[0]);
    }
  }, [currentLevel, currentPage]);

  useEffect(() => {
    updateWords();
  }, [currentLevel, currentPage, updateWords]);

  const handleClickLevel = (e: MouseEvent<HTMLButtonElement>): void => {
    const { innerText } = e.target as HTMLButtonElement;
    if (currentLevel !== innerText) {
      setCurrentLevel(innerText);
      setCurrentPage(1);
    }
  };

  const handleClickWord = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    const word = currentWords.filter((item) => item.word === button.innerText)[0];
    setCurrentWord(word);
  };

  const levelButtons = englishLevels.map((level) => (
    <EnglishLevelButton
      key={level.toLowerCase()}
      active={currentLevel === level}
      onClick={handleClickLevel}
    >
      {level}
    </EnglishLevelButton>
  ));

  const wordElements = currentWords.map((word, i) => {
    const isActive = (currentWord && currentWord.word === word.word) || (!currentWord && i === 0);

    return (
      <WordButton key={word.word} active={isActive} onClick={handleClickWord}>
        {word.word}
      </WordButton>
    );
  });

  const handleChangePage = ({ selected }: { selected: number }): void =>
    setCurrentPage(selected + 1);

  const getPageRangeDisplayedValue = (): number => {
    if (currentPage === 1 || currentPage === 29 || currentPage === 30) return 5;
    if (currentPage === 2 || currentPage === 3 || currentPage === 28) {
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
      initialPage={currentPage - 1}
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
        <div className={s.pagination}>{paginate}</div>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
