import { ReactElement } from 'react';
import Footer from './Footer';
import Header from './Header';

const EditorLayout = (props: { children: ReactElement }) => {
	const { children } = props;
	return (
		<div>
			<Header />
			{children}
			<Footer />
		</div>
	);
};

export default EditorLayout;
