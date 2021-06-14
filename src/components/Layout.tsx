import styles from '@style/Home.module.css';
import { ReactElement } from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = (props: { children: ReactElement }) => {
	const { children } = props;
	return (
		<div className={styles.container}>
			<Header />

			{children}

			<Footer />
		</div>
	);
};

export default Layout;
