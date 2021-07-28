import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { Provider as NextAuthProvider } from "next-auth/client";
import { useCreateStore, Provider as ZustandProvider } from "../libs/store";
import SpotifyProvider from "../components/SpotifyProvider";
import { config } from "../libs";

export default function App({ Component, pageProps }) {
	const createStore = useCreateStore(pageProps.initialZustandState);
	return (
		<ZustandProvider createStore={createStore}>
			<NextAuthProvider
				session={pageProps.session}
				options={{
					clientMaxAge: config.EXPIRATION_TIME,
					keepAlive: config.KEEP_ALIVE,
				}}
			>
				<SpotifyProvider>
					<Component {...pageProps} />
				</SpotifyProvider>
			</NextAuthProvider>
		</ZustandProvider>
	);
}
