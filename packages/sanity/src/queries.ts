export const postProjection = `{
  "id": _id,
  type,
  "slug": slug.current,
  title,
  subtitle,
  summary,
  "thumbnailUrl": thumbnail.asset->url,
  status,
  "publishedAt": publishedAt,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
}`

export const publishedPostsQuery = `*[
  _type == "post" &&
  status == "published"
] | order(publishedAt desc) ${postProjection}`

export const postBySlugQuery = `*[
  _type == "post" &&
  slug.current == $slug
][0] {
  ...,
  "id": _id,
  "slug": slug.current,
  "thumbnailUrl": thumbnail.asset->url,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
  blocks[] {
    ...,
    image {
      ...,
      "url": asset->url
    },
    images[] {
      ...,
      "url": asset->url
    },
    video {
      ...,
      "url": asset->url
    }
  }
}`
