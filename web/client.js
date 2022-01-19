import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: 'j8xsyonv',
    dataset: 'production',
    useCdn: true // `false` if you want to ensure fresh data
})