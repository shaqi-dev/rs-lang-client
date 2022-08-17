import { FC, useState, useEffect, MouseEvent, useCallback } from 'react';
import Paginate from '../../components/Paginate';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import WordList from '../../components/WordList';
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

  const levelButtons = englishLevels.map((level) => (
    <EnglishLevelButton
      key={level.toLowerCase()}
      active={currentLevel === level}
      onClick={handleClickLevel}
    >
      {level}
    </EnglishLevelButton>
  ));

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
          {serverError && serverErrorBanner}
          {!serverError && (
            <WordList words={currentWords} activeWord={currentWord} onClickItem={setCurrentWord} />
          )}
          <div className={s.wordsCard}>
            {currentWord && `${currentWord.word} - ${currentWord.wordTranslate}`}
          </div>
        </div>
        {currentWords && (
          <Paginate
            pageCount={maxPages}
            forcePage={currentPage - 1}
            onPageChage={({ selected }): void => setCurrentPage(selected + 1)}
          />
        )}
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
