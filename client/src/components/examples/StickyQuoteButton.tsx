import StickyQuoteButton from "../StickyQuoteButton";

export default function StickyQuoteButtonExample() {
  return (
    <div className="h-screen relative">
      <StickyQuoteButton itemCount={5} onClick={() => console.log("Quote button clicked")} />
    </div>
  );
}
