import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: 'j8xsyonv',
    dataset: 'production',
    apiVersion: '2022-01-20',
    useCdn: true // `false` if you want to ensure fresh data
})