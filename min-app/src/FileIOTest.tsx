import styles from './FileIOTest.module.css';
import { invoke } from "@tauri-apps/api/core";

type ButtonProps = {
	label: string;
	onClick?: () => void;
	variant?: 'primary' | 'secondary';
	disabled?: boolean;
};

async function FileIO () {
  // if (typeof (window as any).__TAURI__ === 'undefined') {
  //   console.warn('Tauri 環境ではないため invoke は呼べません');
  //   return null;
  // }
	await invoke('my_custom_command');
	console.log("FileIOTest");
}

function FileIOTest({
			label,
			onClick = FileIO,
			variant = 'secondary',
			disabled = false,
		}: ButtonProps) {


	// variant に応じてクラスを切り替える
	const classNames = `${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''}`;

	return (
		<button className={classNames} onClick={onClick} disabled={disabled}>
			{label}
		</button>
	);
}

export default FileIOTest;
