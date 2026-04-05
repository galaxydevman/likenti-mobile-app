export const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, sortKey: BEST_SELLING, after: $after) {
      nodes {
        id
        title
        description
        productType
        featuredImage {
          url
        }
        images(first: 20) {
          nodes {
            url
          }
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
        variants(first: 1) {
          nodes {
            id
            title
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

export const PRODUCT_SEARCH_QUERY = `
  query ProductSearch($first: Int!, $query: String!, $after: String) {
    products(first: $first, query: $query, after: $after) {
      nodes {
        id
        title
        description
        productType
        featuredImage {
          url
        }
        images(first: 20) {
          nodes {
            url
          }
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
        variants(first: 1) {
          nodes {
            id
            title
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
          description
          productType
          featuredImage {
            url
          }
          images(first: 20) {
            nodes {
              url
            }
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
          variants(first: 1) {
            nodes {
              id
              title
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

export const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
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
            products(first: 1) {
              nodes {
                featuredImage {
                  url
                }
              }
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
              products(first: 1) {
                nodes {
                  featuredImage {
                    url
                  }
                }
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
                products(first: 1) {
                  nodes {
                    featuredImage {
                      url
                    }
                  }
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
