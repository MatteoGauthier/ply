module.exports = {
  mode: 'jit',
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	presets :[
		require('tw-utils/font/poppins/'),
		require('tw-utils/colors/full'),
		require('full-palette')
	]
};
