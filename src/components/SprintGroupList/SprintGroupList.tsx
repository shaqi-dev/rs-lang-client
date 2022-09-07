import { FC } from 'react';
import s from './SprintGroupList.module.scss';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppSelector } from '../../hooks/redux';
import SprintGroupItem from '../SprintGroupItem';
import { selectSprintGroup } from '../../store/sprint/sprintSlice';

export interface SprintGroupListProps {
  onClickItem: (groupName: string) => void;
}

const SprintGroupList: FC<SprintGroupListProps> = ({ onClickItem }) => {
  const activeGroup: number = useAppSelector(selectSprintGroup);
  const activeGroupName: string = wordsGroupNames[activeGroup];

  return (
    <ul className={s.root}>
      {wordsGroupNames.map((name) => (
        <li className={s.listItem} key={name}>
          <SprintGroupItem
            active={activeGroupName === name}
            onClick={(): void => onClickItem(name)}
            className={name}
          >
            {name}
          </SprintGroupItem>
        </li>
      ))}
    </ul>
  );
};

export default SprintGroupList;
