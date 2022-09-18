import { FC } from 'react';
import WordsGroupItem from '../WordsGroupItem';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppSelector } from '../../hooks/redux';
import { selectCurrentGroup } from '../../store/textbook/textbookSlice';
import s from './WordsGroupList.module.scss';

export interface WordsGroupListProps {
  onClickItem: (groupName: string) => void;
}

const WordsGroupList: FC<WordsGroupListProps> = ({ onClickItem }) => {
  const activeGroup: number = useAppSelector(selectCurrentGroup);
  const activeGroupName: string = wordsGroupNames[activeGroup];

  return (
    <ul className={s.root}>
      {wordsGroupNames.map((name) => (
        <li className={s.listItem} key={name}>
          <WordsGroupItem
            className={name}
            active={activeGroupName === name}
            onClick={(): void => onClickItem(name)}
          >
            {name}
          </WordsGroupItem>
        </li>
      ))}
    </ul>
  );
};

export default WordsGroupList;
