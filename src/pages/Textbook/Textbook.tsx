import { FC, useState, MouseEvent } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import s from './Textbook.module.scss';

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Textbook: FC = () => {
  const [currentLevel, setCurrentLevel] = useState<string>(englishLevels[0]);

  const handleClickLevel = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    setCurrentLevel(button.innerText);
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.levelsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <div className={s.levelsButtons}>
          {englishLevels.map((level) => (
            <EnglishLevelButton
              key={level.toLowerCase()}
              active={currentLevel === level}
              onClick={handleClickLevel}
            >
              {level}
            </EnglishLevelButton>
          ))}
        </div>
      </section>
      <section className={s.words}>
        <p className={s.sectionTitle}>Слова</p>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
