import Layout from '@component/Layout';
import styles from '@style/Home.module.css';

export default function Home() {
	return (
		<Layout>
			<main className={styles.main}>
				<h1 className={styles.title}>
          Welcome to <br />
					<a href="https://nyxordinal.tech">
            Nyxordinal <br /> Online Editor!
					</a>
				</h1>

				<p className={styles.description}>
          Get started by creating your new note via <code className={styles.code}>/[your-notes-title]</code>
				</p>
			</main>
		</Layout>
	);
}
