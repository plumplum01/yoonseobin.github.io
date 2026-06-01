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

export const mediaAssetProjection = `{
  "id": _id,
  title,
  type,
  alt,
  caption,
  credit,
  tags,
  durationSeconds,
  "imageUrl": image.asset->url,
  "videoUrl": video.asset->url,
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
    media-> ${mediaAssetProjection},
    mediaItems[]-> ${mediaAssetProjection}
  }
}`

export const profileQuery = `*[
  _type == "profile" &&
  _id == "profile"
][0] {
  heading,
  paragraphs,
  education[] {
    title,
    startDate,
    endDate,
    isCurrent
  },
  awards[] {
    title,
    desc,
    awardedAt
  },
  links[] {
    label,
    href
  }
}`
