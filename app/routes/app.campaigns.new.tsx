import { useEffect, useState } from "react";

export default function NewCampaign() {
  const [game, setGame] = useState("spin");
  
  const [rewardCount, setRewardCount] = useState(3);
  const [rewards, setRewards] = useState(["", "", ""]);
  useEffect(() => {
    setRewards((currentRewards) => {
      if (currentRewards.length < rewardCount) {
        return [
          ...currentRewards,
          ...Array(rewardCount - currentRewards.length).fill(""),
        ];
      }
  
      return currentRewards.slice(0, rewardCount);
    });
  }, [rewardCount]);
  const rewardLimits = {
    spin: { min: 3, max: 5 },
    scratch: { min: 1, max: 1 },
    mystery: { min: 1, max: 1 },
    quiz: { min: 1, max: 1 },
  };
  const currentLimits = rewardLimits[game as keyof typeof rewardLimits];
  return (
    
    <s-page heading="Create Campaign">
      <s-section heading="Campaign Details">
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Campaign name"
            placeholder="e.g. Halloween Mystery Pumpkin"
          />

        <s-select
          label="Game"
          value={game}
          onChange={(event) => setGame(event.currentTarget.value)}
        >
          <s-option value="spin">Spin the Wheel</s-option>
          <s-option value="scratch">Scratch Card</s-option>
          <s-option value="mystery">Mystery Box</s-option>
          <s-option value="quiz">Quiz</s-option>
        </s-select>

          <s-select label="Theme">
            <s-option value="none">No Theme</s-option>
            <s-option value="halloween">🎃 Halloween</s-option>
            <s-option value="christmas">🎄 Christmas</s-option>
            <s-option value="diwali">🪔 Diwali</s-option>
            <s-option value="valentines">💗 Valentine's Day</s-option>
            <s-option value="black-friday">🛍️ Black Friday</s-option>
            <s-option value="new-year">🎉 New Year</s-option>
            <s-option value="summer">☀️ Summer Sale</s-option>
          </s-select>

          <s-select
          label="Number of Rewards"
          value={String(rewardCount)}
          onChange={(event) =>
            setRewardCount(Number(event.currentTarget.value))
          }
        >
          {Array.from(
            {
              length: currentLimits.max - currentLimits.min + 1,
            },
            (_, index) => {
              const count = currentLimits.min + index;

              return (
                <s-option key={count} value={String(count)}>
                  {count}
                </s-option>
              );
            },
          )}
        </s-select>

        <s-section heading="Reward Outcomes">
        <s-stack direction="block" gap="base">
          {rewards.slice(0, rewardCount).map((reward, index) => (
            <s-text-field
              key={index}
              label={`Reward ${index + 1}`}
              value={reward}
            />
          ))}
        </s-stack>
      </s-section>

          <s-select label="Placement">
            <s-option value="popup">Storefront Popup</s-option>
            <s-option value="banner">Storefront Banner</s-option>
            <s-option value="inline">Inline on Storefront</s-option>
          </s-select>
        </s-stack>
      </s-section>

      <s-section>
        <s-button variant="primary">
          Create Campaign
        </s-button>
      </s-section>
    </s-page>
  );
}