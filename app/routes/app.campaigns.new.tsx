import { useState } from "react";

export default function NewCampaign() {
  const [campaignName, setCampaignName] = useState("");

  return (
    <s-page heading="Create Campaign">
      <s-section heading="Campaign Details">
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Campaign name"
            value={campaignName}
            onChange={(event) =>
              setCampaignName((event.target as HTMLInputElement).value)
            }
            placeholder="e.g. Halloween Mystery Pumpkin"
          />

          <s-section heading="Game">
            <s-paragraph>🎮 Spin the Wheel</s-paragraph>
          </s-section>

          <s-section heading="Theme">
            <s-paragraph>🎃 Halloween</s-paragraph>
          </s-section>

          <s-section heading="Reward">
            <s-paragraph>🎁 15% OFF</s-paragraph>
          </s-section>

          <s-section heading="Placement">
            <s-paragraph>📍 Storefront popup</s-paragraph>
          </s-section>

          <s-button variant="primary">
            Create Campaign
          </s-button>
        </s-stack>
      </s-section>
    </s-page>
  );
}