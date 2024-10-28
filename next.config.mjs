/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: 'i.scdn.co',
			},
		],
		unoptimized: true,
	},
};

export default nextConfig;
