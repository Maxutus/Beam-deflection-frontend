export const isPagesBuild = import.meta.env.MODE === 'pages'
export const publicAsset = (file: string) => `${import.meta.env.BASE_URL}${file}`
