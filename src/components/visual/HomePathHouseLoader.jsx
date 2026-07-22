import HomePathHouseIllustration from "./HomePathHouseIllustration";

export default function HomePathHouseLoader({ stage = 0, height = 420 }) {
  return <div className="house-loader" style={{ minHeight: height }} role="status" aria-live="polite">
    <HomePathHouseIllustration stage={stage} height={Math.min(260, height)} reducedMotion />
    <p>Loading interactive HomePath house…</p>
  </div>;
}
