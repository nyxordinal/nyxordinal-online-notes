import { createTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import '@style/editors.css';
import '@style/globals.css';
import { AppProps } from 'next/app';

// Customize material-ui theme
const theme = createTheme({
	palette: {
		primary: {
			main: '#2196f3',
		},
		secondary: {
			main: '#ff3d00',
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
