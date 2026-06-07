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
  "url": select(
    type == "image" => image.asset->url,
    type == "video" => video.asset->url
  ),
  "alt": coalesce(image.alt, caption),
  caption,
  tags[]-> {
    "id": _id,
    title,
    "slug": slug.current
  },
  durationSeconds,
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
  "id": _id,
  type,
  "slug": slug.current,
  title,
  subtitle,
  summary,
  "thumbnailUrl": thumbnail.asset->url,
  status,
  publishedAt,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
  blocks[] {
    _type == "textBlock" => {
      "type": "text",
      body
    },
    _type == "headingBlock" => {
      "type": "heading",
      level,
      text
    },
    _type == "imageBlock" => {
      "type": "image",
      "media": media-> ${mediaAssetProjection},
      "aspectRatio": coalesce(aspectRatio, "video")
    },
    _type == "carouselBlock" => {
      "type": "carousel",
      "mediaItems": mediaItems[]-> ${mediaAssetProjection}
    },
    _type == "videoBlock" => {
      "type": "video",
      "media": media-> ${mediaAssetProjection},
      "aspectRatio": coalesce(aspectRatio, "video")
    }
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
