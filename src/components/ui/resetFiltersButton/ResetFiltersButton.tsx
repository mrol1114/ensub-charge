import styles from "./styles.module.scss";

type Props = {
    onClick: () => void;
    disabled: boolean;
    activeIcon: string;
    disabledIcon: string;
    text: string;
};

export default function ResetFiltersButton(props: Props) {
    return (
        <button 
            className={`${styles.resetButton} ${props.disabled ? styles.resetButton_disabled : styles.resetButton_active}`} 
            onClick={props.onClick} 
            disabled={props.disabled}
        >
            <img src={props.disabled ? props.disabledIcon : props.activeIcon} alt="resetFiltersIcon" />
            <span>{props.text}</span>
        </button>
    );
}
