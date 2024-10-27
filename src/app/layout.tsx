import { Dialog } from '@/components/Dialog';
import { Navbar } from '@/components/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Orpheus',
	description: 'Get music recommendations based on artists, tracks, genres, and track attributes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='bg-slate-900/85'>
				<Dialog />
				<Navbar />
				{children}
			</body>
		</html>
	);
}
