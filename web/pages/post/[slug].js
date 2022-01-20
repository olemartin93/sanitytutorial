import client from "../../client"
import groq from "groq"
import imageUrlBuilder from '@sanity/image-url'
import author from "../../../studio/schemas/author"

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
function urlFor (source) {
    return builder.image(source)
}

const Post = ({post}) => {

    const { title = "Missing title", 
    name = "Missing name", 
    publishedAt, 
    byline = "", 
    categories,
    authorImage
} = post

    //const blogDate = new Date(publishedAt).toDateString()   |   <p>{byline} - {blogDate}</p>

    return (
        <article>
            <h1>{title}</h1>
            <span>By {name}</span>
            {categories && (
        <ul>
          Posted in
          {categories.map(category => <li key={category}>{category}</li>)}
        </ul>
      )}
      {authorImage && (
          <div>
                <img 
                src={urlFor(authorImage)
                .width(200)
                .url()} 
                />
          </div>
      )}
        </article>
    )
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    "name": author->name,
    "categories": categories[]->title,
    "authorImage": author->image
}`

export async function getStaticPaths() {
      const paths = await client.fetch(`
        *[_type == "post" && defined(slug.current)][].slug.current
        `
        )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true
  }
}

export async function getStaticProps(context) {
    // It's important to default the slug so that it doesn't return "undefined"
    const { slug = "" } = context.params

    /**
     * Now that we have added the const query with groq above, we will rewrite this const post to the one below
     * const post = await client.fetch(`
    ** [_type == "post" && slug.current == $slug][0]{title, "name": author->name, "byline": author->byline, publishedAt}
    ** `, { slug })
     */

    const post = await client.fetch(query, { slug })
    
    return {
        props: {
            post
        }
    }
}

export default Post