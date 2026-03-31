export const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, sortKey: BEST_SELLING, after: $after) {
      nodes {
        id
        title
        productType
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($first: Int!, $handle: String!, $after: String) {
    collectionByHandle(handle: $handle) {
      products(first: $first, after: $after) {
        nodes {
          id
          title
          productType
          featuredImage {
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const MAIN_MENU_QUERY = `
  query MainMenu {
    menu(handle: "main-menu") {
      items {
        id
        title
        url
        resource {
          __typename
          ... on Collection {
            id
            handle
            image {
              url
            }
          }
        }
        items {
          id
          title
          url
          resource {
            __typename
            ... on Collection {
              id
              handle
              image {
                url
              }
            }
          }
          items {
            id
            title
            url
            resource {
              __typename
              ... on Collection {
                id
                handle
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const HERO_BANNERS_QUERY = `
  query HeroBanners($first: Int!) {
    metaobjects(type: "hero_banner", first: $first) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;
