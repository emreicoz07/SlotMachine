// ReelComponent.tsx
interface ReelProps {
  symbol: string;
  spinning: boolean;
}
const Reel = ({ symbol, spinning }: { symbol: string; spinning: boolean }) => {
  console.log('Reel Symbol:', symbol); // Gelen sembolleri kontrol etmek için log.

  return (
    <div className={`reel ${spinning ? 'spinning' : ''}`}>
      <div className="symbols">
        <img src={symbol} alt="Reel Symbol" />
      </div>
    </div>
  );
};

export default Reel;
