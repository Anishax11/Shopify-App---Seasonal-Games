import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { Link } from "react-router";
import NewCampaign from "./app.campaigns.new";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const campaigns = await prisma.campaign.findMany({
    where: {
      shop: session.shop,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { campaigns };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            titlei
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
            demoInfo: metafield(namespace: "$app", key: "demo_info") {
              jsonValue
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
          metafields: [
            {
              namespace: "$app",
              key: "demo_info",
              value: "Created by React Router Template",
            },
          ],
        },
      },
    },
  );
  const responseJson = await response.json();

  const product = responseJson.data!.productCreate!.product!;
  const variantId = product.variants.edges[0]!.node!.id!;

  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  const metaobjectResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpsertMetaobject($handle: MetaobjectHandleInput!, $values: JSON!) {
      metaobjectUpsert(handle: $handle, values: $values) {
        metaobject {
          id
          handle
          values
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        handle: {
          type: "$app:example",
          handle: "demo-entry",
        },
        values: {
          title: "Demo Entry",
          description:
            "This metaobject was created by the Shopify app template to demonstrate the metaobject API.",
        },
      },
    },
  );

  const metaobjectResponseJson = await metaobjectResponse.json();

  return {
    product: responseJson!.data!.productCreate!.product,
    variant:
      variantResponseJson!.data!.productVariantsBulkUpdate!.productVariants,
    metaobject: metaobjectResponseJson!.data!.metaobjectUpsert!.metaobject,
  };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const { campaigns } = useLoaderData<typeof loader>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.product?.id) {
      shopify.toast.show("Product created");
    }
  }, [fetcher.data?.product?.id, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    
    <s-page heading="Seasonal Games">
      <s-button slot="primary-action" onClick={generateProduct}>
        Generate a product
      </s-button>

      <s-section heading="Welcome to Seasonal Games!">
      <s-paragraph>
        Create interactive seasonal campaigns that engage your customers and
        unlock special rewards.
      </s-paragraph>
      </s-section>
      <s-section heading="Your Campaigns">
        <s-stack direction="block" gap="small">
          <s-paragraph>
            Create interactive campaigns that turn promotions into experiences.
          </s-paragraph>
          <Link to="/app/campaigns/new">
              <s-button variant="primary">
                Create Campaign
              </s-button>
            </Link>
        </s-stack>
   
    </s-section>

          {campaigns.length === 0 ? (
        <s-paragraph>
          You don't have any campaigns yet. Create your first campaign to get
          started.
        </s-paragraph>
      ) : (
        campaigns.map((campaign) => (
          <s-section key={campaign.id} heading={campaign.name}>
            <s-stack direction="block" gap="small">
              <s-paragraph>
                🎮 Game: {campaign.game}
              </s-paragraph>

              <s-paragraph>
                🎁 Rewards: {campaign.rewardCount}
              </s-paragraph>

              <s-paragraph>
                🎨 Theme: {campaign.theme}
              </s-paragraph>

              <s-paragraph>
                📍 Placement: {campaign.placement}
              </s-paragraph>

              <s-badge tone={campaign.status === "active" ? "success" : "info"}>
                {campaign.status}
              </s-badge>
            </s-stack>
          </s-section>
        ))
      )}
    </s-page>
  );
        }     
      
 
export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
