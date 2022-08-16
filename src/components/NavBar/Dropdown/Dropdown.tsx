import { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './Dropdown.module.scss';

export interface DropdownOption {
  name: string;
  link: string;
}

interface DropdownProps {
  options: DropdownOption[];
}

const Dropdown: FC<DropdownProps> = ({ options }) => {
  return (
    <div className={s.root}>
      <span className={s.handler}>Игры</span>
      <ul className={s.list}>
        {options.map((option) => (
          <li className={s.item} key={`dropdown-${option.name}`}>
            <Link to={option.link} className={s.link}>
              {option.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
