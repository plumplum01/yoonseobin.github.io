const postHeaderViewFields = `
  "id": _id,
  "type": select(type == "blog" => "article", type),
  "slug": slug.current,
  title,
  subtitle,
  summary,
  "thumbnailUrl": thumbnail.asset->url,
  status,
  publishedAt,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
`

export const mediaAssetViewProjection = `{
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
  status == "published" &&
  type in ["project", "article", "reel", "blog"]
] | order(publishedAt desc) {
  ${postHeaderViewFields}
}`

export const publishedReelsQuery = `*[
  _type == "post" &&
  status == "published" &&
  type == "reel"
] | order(publishedAt desc) {
  ${postHeaderViewFields}
}`

export const postBySlugQuery = `*[
  _type == "post" &&
  slug.current == $slug &&
  type in ["project", "article", "reel", "blog"]
][0] {
  ${postHeaderViewFields},
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
      "media": media-> ${mediaAssetViewProjection},
      "aspectRatio": coalesce(aspectRatio, "video")
    },
    _type == "imageStackBlock" => {
      "type": "imageStack",
      "mediaItems": mediaItems[]-> ${mediaAssetViewProjection}
    },
    _type == "carouselBlock" => {
      "type": "carousel",
      "mediaItems": mediaItems[]-> ${mediaAssetViewProjection}
    },
    _type == "videoBlock" => {
      "type": "video",
      "media": media-> ${mediaAssetViewProjection},
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
